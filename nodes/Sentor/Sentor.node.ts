import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Sentor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sentor Sentiment Analysis',
		name: 'sentor',
		icon: 'file:sentor-v2.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'AI-powered sentiment analysis for text documents',
		defaults: {
			name: 'Sentor Sentiment Analysis',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sentorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Service',
						value: 'service',
					},
				],
				default: 'document',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Predict Sentiment',
						value: 'predict',
						description: 'Analyze sentiment of text document',
						action: 'Predict sentiment of a document',
					},
				],
				default: 'predict',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['service'],
					},
				},
				options: [
					{
						name: 'Health Check',
						value: 'healthCheck',
						description: 'Check if the Sentor API is available and healthy',
						action: 'Check API health status',
					},
				],
				default: 'healthCheck',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['predict'],
					},
				},
				options: [
					{
						name: 'English',
						value: 'en',
					},
					{
						name: 'German',
						value: 'de',
					},
					{
						name: 'Dutch',
						value: 'nl',
					},
				],
				default: 'en',
				description: 'The language of the documents to analyze',
			},
			{
				displayName: 'Document Text',
				name: 'documentText',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['predict'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Enter the text to analyze...',
				description: 'The text content to analyze for sentiment',
			},
		{
			displayName: 'Entities',
			name: 'entities',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			displayOptions: {
				show: {
					resource: ['document'],
					operation: ['predict'],
				},
			},
			default: {},
			placeholder: 'Add Entity',
			description: 'Optional list of entities to analyze within the text',
			options: [
				{
					displayName: 'Entity',
					name: 'entityValues',
					values: [
						{
							displayName: 'Entity Name',
							name: 'entity',
							type: 'string',
							default: '',
							placeholder: 'e.g., company, product, service',
							description: 'Name of the entity to analyze',
						},
					],
				},
			],
		},
			{
				displayName: 'Simplify Output',
				name: 'simplify',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['predict'],
					},
				},
				default: true,
				description:
					'Whether to return a simplified output with just label, probability, and details',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		if (resource === 'service' && operation === 'healthCheck') {
			// Health check endpoint
			try {
				const requestOptions: IHttpRequestOptions = {
					method: 'GET',
					url: 'https://sentor.app/api/health',
					json: true,
				};

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'sentorApi',
					requestOptions,
				)) as {
					status: string;
					timestamp: string;
				};

				returnData.push({
					json: response as unknown as IDataObject,
					pairedItem: { item: 0 },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: 0 },
					});
				} else {
					throw new NodeApiError(this.getNode(), error as any, {
						message: 'Failed to check API health',
						description: error.message,
					});
				}
			}
		} else if (resource === 'document' && operation === 'predict') {
			const language = this.getNodeParameter('language', 0) as string;

			// Build the payload for batch processing
			const docs: Array<{
				doc: string;
				doc_id: string;
				entities?: string[];
			}> = [];

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					const documentText = this.getNodeParameter('documentText', itemIndex) as string;
					const entitiesCollection = this.getNodeParameter('entities', itemIndex, {}) as IDataObject;

					if (!documentText || documentText.trim() === '') {
						throw new NodeOperationError(
							this.getNode(),
							'Document text is required and cannot be empty',
							{ itemIndex },
						);
					}

					const docPayload: {
						doc: string;
						doc_id: string;
						entities?: string[];
					} = {
						doc: documentText,
						doc_id: `doc_${itemIndex}`,
					};

					// Parse entities if provided
					if (entitiesCollection && entitiesCollection.entityValues) {
						const entityItems = entitiesCollection.entityValues as Array<{ entity: string }>;
						const entities = entityItems
							.map((e) => e.entity?.trim())
							.filter((e) => e && e.length > 0);
						if (entities.length > 0) {
							docPayload.entities = entities as string[];
						}
					}

					docs.push(docPayload);
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: error.message },
							pairedItem: { item: itemIndex },
						});
						continue;
					}
					throw error;
				}
			}

			// Make the API request if we have documents to process
			if (docs.length > 0) {
				try {
					const requestOptions: IHttpRequestOptions = {
						method: 'POST',
						url: `https://sentor.app/api/predicts?language=${language}`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: {
							docs,
						},
						json: true,
					};

					const response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'sentorApi',
						requestOptions,
					)) as {
						results: Array<{
							doc_id: string;
							predicted_class: number;
							predicted_label: string;
							probabilities: IDataObject;
							details: Array<IDataObject>;
						}>;
					};

					// Process the response
					if (!response.results || !Array.isArray(response.results)) {
						throw new NodeApiError(this.getNode(), {
							message: 'Invalid response from Sentor API',
							description: 'The API did not return results in the expected format',
						});
					}

					const simplify = this.getNodeParameter('simplify', 0) as boolean;

					// Map results back to input items
					for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
						const docId = `doc_${itemIndex}`;
						const result = response.results.find((r) => r.doc_id === docId);

						if (!result) {
							if (this.continueOnFail()) {
								returnData.push({
									json: { error: 'No result found for this document' },
									pairedItem: { item: itemIndex },
								});
								continue;
							}
							throw new NodeApiError(this.getNode(), {
								message: `No result found for document ${docId}`,
								description: 'The API did not return a result for this document',
							});
						}

					if (simplify) {
						// Simplified output
						const probability =
							result.probabilities[result.predicted_label as string] || 0;
						returnData.push({
							json: {
								predicted_class: result.predicted_class,
								predicted_label: result.predicted_label,
								probability,
								details: result.details,
							},
							pairedItem: { item: itemIndex },
						});
					} else {
						// Full output
						returnData.push({
							json: result as unknown as IDataObject,
							pairedItem: { item: itemIndex },
						});
					}
					}
				} catch (error) {
					if (this.continueOnFail()) {
						for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
							returnData.push({
								json: { error: error.message },
								pairedItem: { item: itemIndex },
							});
						}
					} else {
						throw new NodeApiError(this.getNode(), error as any, {
							message: 'Failed to analyze sentiment',
							description: error.message,
						});
					}
				}
			}
		}

		return [returnData];
	}
}

