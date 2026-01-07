import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
	ISupplyDataFunctions,
	SupplyData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Sentor implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sentor Sentiment Analysis',
		name: 'sentor',
		icon: {
			light: 'file:sentor-v3.svg',
			dark: 'file:sentor-v3.dark.svg',
		},
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
				displayOptions: {
					show: {
						'/operation': [
							'predict',
							'healthCheck',
							'cluster',
							'topicName',
						],
					},
				},
			},
			{
				name: 'googleGeminiApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['topicName'],
					},
				},
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Environment',
				name: 'environment',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Production',
						value: 'production',
					},
					{
						name: 'Development',
						value: 'dev',
					},
				],
				default: 'production',
			},
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
						name: 'Cluster Documents',
						value: 'cluster',
						description: 'Cluster documents using BERTopic',
						action: 'Cluster documents',
					},
					{
						name: 'Generate Topic Name',
						value: 'topicName',
						description: 'Generate a descriptive topic name for a cluster',
						action: 'Generate topic name',
					},
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
			// Common inputs
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
						name: 'Dutch',
						value: 'nl',
					},
				],
				default: 'en',
				description: 'The language of the documents to analyze',
			},
			// Inputs for Predict
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
				displayName: 'Document ID',
				name: 'docId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['predict'],
					},
				},
				default: '',
				description: 'Unique identifier for the document',
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
				required: true,
				description: 'Required list of entities to analyze within the text. Must contain at least 1 entity.',
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
			// Inputs for Cluster
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['cluster', 'topicName'],
					},
				},
				default: 'en',
				description: 'Language code (e.g., en, de, nl)',
			},
			{
				displayName: 'Input Format',
				name: 'inputFormat',
				type: 'options',
				options: [
					{
						name: 'JSON Parameter',
						value: 'json',
						description: 'Enter documents as a JSON array',
					},
					{
						name: 'Manually Defined',
						value: 'manual',
						description: 'Define documents using the UI',
					},
				],
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['cluster'],
					},
				},
				default: 'json',
			},
			{
				displayName: 'Documents (JSON)',
				name: 'documentsJson',
				type: 'json',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['cluster'],
						inputFormat: ['json'],
					},
				},
				default: '',
				description: 'List of documents to cluster. Each object must have doc_id, text, and optionally entities.',
			},
			{
				displayName: 'Documents',
				name: 'documentsUi',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['cluster'],
						inputFormat: ['manual'],
					},
				},
				default: {},
				placeholder: 'Add Document',
				options: [
					{
						name: 'documentValues',
						displayName: 'Document',
						values: [
							{
								displayName: 'Document ID',
								name: 'doc_id',
								type: 'string',
								default: '',
								description: 'Unique identifier for the document',
							},
							{
								displayName: 'Text',
								name: 'text',
								type: 'string',
								default: '',
								description: 'Content of the document',
							},
							{
								displayName: 'Entities',
								name: 'entities',
								type: 'string',
								default: '',
								description: 'Comma-separated list of entities',
							},
						],
					},
				],
			},
			{
				displayName: 'Number of Clusters',
				name: 'n_clusters',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['cluster'],
					},
				},
				default: 0,
				description: 'Optional target number of clusters. If 0, HDBSCAN will determine automatically.',
			},
			// Inputs for Topic Name
			{
				displayName: 'Cluster ID',
				name: 'clusterId',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['topicName'],
					},
				},
				default: 0,
				required: true,
			},
			{
				displayName: 'Documents (JSON)',
				name: 'clusterDocuments',
				type: 'json',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['topicName'],
					},
				},
				default: '',
				required: true,
				description: 'Array of documents in the cluster (output from cluster operation)',
			},
			{
				displayName: 'Entities (JSON)',
				name: 'clusterEntities',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['topicName'],
					},
				},
				default: '[]',
				description: 'List of entities associated with the cluster',
			},
			{
				displayName: 'Top Words (JSON)',
				name: 'topWords',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['topicName'],
					},
				},
				default: '[]',
				description: 'List of top words for the cluster',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const environment = this.getNodeParameter('environment', 0) as string;
		const baseUrl =
			environment === 'dev' ? 'https://dev.sentor.app' : 'https://sentor.app';

		if (resource === 'service' && operation === 'healthCheck') {
			// Health check endpoint
			try {
				const requestOptions: IHttpRequestOptions = {
					method: 'GET',
					url: `${baseUrl}/api/health`,
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
				const e = error as NodeApiError;
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: e.message },
						pairedItem: { item: 0 },
					});
				} else {
					throw new NodeApiError(this.getNode(), e as unknown as JsonObject, {
						message: 'Failed to check API health',
						description: e.message,
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


					if (!documentText || documentText.trim() === '') {
						throw new NodeOperationError(
							this.getNode(),
							'Document text is required and cannot be empty',
							{ itemIndex },
						);
					}

					const docId = this.getNodeParameter('docId', itemIndex, '') as string;

					const docPayload: {
						doc: string;
						doc_id: string;
						entities?: string[];
					} = {
						doc: documentText,
						doc_id: docId || `doc_${itemIndex}`,
					};

					// Parse entities - support both entityValues structure and direct array
					const entitiesParam = this.getNodeParameter('entities', itemIndex, {}) as any;
					let entities: string[] = [];

					const parseEntityValue = (val: any): string => {
						if (typeof val === 'string') return val.trim();
						if (typeof val === 'number') return String(val).trim();
						if (val && typeof val === 'object' && val.entity) return String(val.entity).trim();
						return '';
					};

					if (Array.isArray(entitiesParam)) {
						// If it's an array, it might be an array of strings OR an array of entity objects
						for (const item of entitiesParam) {
							if (item && typeof item === 'object' && item.entityValues) {
								// Case: [{ entityValues: [...] }]
								if (Array.isArray(item.entityValues)) {
									entities.push(...item.entityValues.map(parseEntityValue));
								}
							} else {
								entities.push(parseEntityValue(item));
							}
						}
					} else if (entitiesParam && typeof entitiesParam === 'object') {
						if (entitiesParam.entityValues && Array.isArray(entitiesParam.entityValues)) {
							// Case: { entityValues: [...] }
							entities = entitiesParam.entityValues.map(parseEntityValue);
						} else {
							// Single object case?
							entities = [parseEntityValue(entitiesParam)];
						}
					}

					// Final cleanup
					entities = entities.filter((e) => e && e.length > 0);

					if (entities.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Entities are required and must contain at least 1 entity',
							{ itemIndex },
						);
					}

					docPayload.entities = entities;

					docs.push(docPayload);
				} catch (error) {
					const e = error as NodeApiError;
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: e.message },
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
						url: `${baseUrl}/api/predicts?language=${language}`,
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
						const docId = docs[itemIndex].doc_id;
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
					const e = error as NodeApiError;
					if (this.continueOnFail()) {
						for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
							returnData.push({
								json: { error: e.message },
								pairedItem: { item: itemIndex },
							});
						}
					} else {
						throw new NodeApiError(this.getNode(), e as unknown as JsonObject, {
							message: 'Failed to analyze sentiment',
							description: e.message,
						});
					}
				}
			}
		} else if (resource === 'document' && operation === 'cluster') {
			const language = this.getNodeParameter('language', 0) as string;
			const n_clusters = this.getNodeParameter('n_clusters', 0) as number;
			const inputFormat = this.getNodeParameter('inputFormat', 0) as string;

			let documents: Array<{ doc_id: string; text: string; entities?: string[] }> = [];

			if (inputFormat === 'json') {
				const jsonInput = this.getNodeParameter('documentsJson', 0);
				if (typeof jsonInput === 'string') {
					documents = JSON.parse(jsonInput);
				} else {
					documents = jsonInput as Array<{ doc_id: string; text: string; entities?: string[] }>;
				}
			} else {
				const uiInput = this.getNodeParameter('documentsUi', 0) as IDataObject;
				if (uiInput.documentValues) {
					documents = (uiInput.documentValues as IDataObject[]).map((d) => ({
						doc_id: d.doc_id as string,
						text: d.text as string,
						entities: (d.entities as string)
							.split(',')
							.map((e) => e.trim())
							.filter((e) => e),
					}));
				}
			}

			const body: IDataObject = {
				documents,
				language,
			};

			if (n_clusters > 0) {
				body.n_clusters = n_clusters;
			}

			const requestOptions: IHttpRequestOptions = {
				method: 'POST',
				url: `${baseUrl}/api/predicts/cluster`,
				headers: {
					'Content-Type': 'application/json',
				},
				body,
				json: true,
			};

			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'sentorApi',
				requestOptions,
			);

			returnData.push({
				json: response as unknown as IDataObject,
				pairedItem: { item: 0 },
			});
		} else if (resource === 'document' && operation === 'topicName') {
			const cluster_id = this.getNodeParameter('clusterId', 0) as number;

			let documents: any[] = [];
			const documentsInput = this.getNodeParameter('clusterDocuments', 0);
			if (typeof documentsInput === 'string') {
				documents = JSON.parse(documentsInput);
			} else {
				documents = documentsInput as any[];
			}

			const language = this.getNodeParameter('language', 0) as string;

			let entities: string[] = [];
			const entitiesInput = this.getNodeParameter('clusterEntities', 0);
			if (typeof entitiesInput === 'string') {
				entities = JSON.parse(entitiesInput);
			} else {
				entities = entitiesInput as string[];
			}

			let top_words: string[] = [];
			const topWordsInput = this.getNodeParameter('topWords', 0);
			if (typeof topWordsInput === 'string') {
				top_words = JSON.parse(topWordsInput);
			} else {
				top_words = topWordsInput as string[];
			}

			const body: IDataObject = {
				cluster_id,
				documents,
				language,
				entities,
				top_words,
			};

			const requestOptions: IHttpRequestOptions = {
				method: 'POST',
				url: `${baseUrl}/api/predicts/topic-name`,
				headers: {
					'Content-Type': 'application/json',
				},
				body,
				json: true,
			};

			// Add Google API Key if present
			let usedGoogleKey = false;
			try {
				// Check if googleGeminiApi is configured and has data
				// We can try to get it, if it fails or returns empty, we skip
				const googleCreds = await this.getCredentials('googleGeminiApi').catch(() => null);
				if (googleCreds && googleCreds.apiKey) {
					// If credentials exist, use them
					usedGoogleKey = true;
					// We need to use chain authentication or add manually.
					// Since we need TWO credentials (Sentor + Google), and n8n helper usually does one,
					// let's do this:
					// 1. Authenticate with Google Credential using helper (which adds X-Google-API-Key)
					// 2. Manually add Sentor API Key header

					const sentorCreds = await this.getCredentials('sentorApi');
					if (sentorCreds.apiKey) {
						if (!requestOptions.headers) requestOptions.headers = {};
						requestOptions.headers['x-api-key'] = sentorCreds.apiKey as string;
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleGeminiApi',
						requestOptions,
					);

					returnData.push({
						json: response as unknown as IDataObject,
						pairedItem: { item: 0 },
					});
				}
			} catch (e) {
				// Ignore error, will fall back
				usedGoogleKey = false;
			}

			if (!usedGoogleKey) {
				// No google credentials, fall back to just Sentor API (company key)
				// This uses the sentorApi credential which adds x-api-key
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'sentorApi',
					requestOptions,
				);
				returnData.push({
					json: response as unknown as IDataObject,
					pairedItem: { item: 0 },
				});
			}
		}

		return [returnData];
	}

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const language = this.getNodeParameter('language', itemIndex, 'en') as string;
		const self = this;

		// Note: AI Agent doesn't seem to have access to node parameters like 'environment' easily unless passed in.
		// For now, we'll default to production or try to read it if possible, but supplyData usually is for tools list.
		// Actually, the execute function of requestOptions needs the baseUrl. 
		// We'll default to production for the tool usage for now as environment selector is on the node main level.

		// Get environment
		const environment = this.getNodeParameter('environment', itemIndex, 'production') as string;
		const baseUrl =
			environment === 'dev' ? 'https://dev.sentor.app/api' : 'https://sentor.app/api';

		// Create a simple tool object that n8n can use for AI Agent
		const tool = {
			name: 'sentor_sentiment_analysis',
			description: 'Analyzes the sentiment of text documents with focus on specific entities. Returns sentiment labels (positive, negative, neutral) with probability scores and details about the specified entities. Works with English (en) and Dutch (nl) languages. Requires at least one entity to analyze.',
			parameters: {
				type: 'object',
				properties: {
					documentText: {
						type: 'string',
						description: 'The text content to analyze for sentiment',
					},
					entities: {
						type: 'array',
						items: { type: 'string' },
						minItems: 1,
						description: 'Required list of entities to analyze within the text (e.g., company names, products, services). Must contain at least 1 entity.',
					},
				},
				required: ['documentText', 'entities'],
			},
			execute: async (args: { documentText: string; entities: string[] }) => {
				// Validate that entities array has at least 1 item
				if (!args.entities || args.entities.length === 0) {
					throw new NodeApiError(self.getNode(), {
						message: 'Entities array is required and must contain at least 1 entity',
						description: 'Please provide at least one entity to analyze',
					});
				}

				const requestOptions: IHttpRequestOptions = {
					method: 'POST',
					url: `${baseUrl}/api/predicts?language=${language}`,
					headers: {
						'Content-Type': 'application/json',
					},
					body: {
						docs: [
							{
								doc: args.documentText,
								doc_id: 'ai_agent_doc',
								entities: args.entities,
							},
						],
					},
					json: true,
				};

				const response = (await self.helpers.httpRequestWithAuthentication.call(
					self,
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

				if (!response.results || !Array.isArray(response.results) || response.results.length === 0) {
					throw new NodeApiError(self.getNode(), {
						message: 'Invalid response from Sentor API',
						description: 'The API did not return results in the expected format',
					});
				}

				const result = response.results[0];

				// Fix: probability access needs correct typing
				const label = result.predicted_label as string;
				const probability = (result.probabilities as IDataObject)[label] as number || 0;

				return {
					predicted_class: result.predicted_class,
					predicted_label: result.predicted_label,
					probability,
					probabilities: result.probabilities,
					details: result.details,
				};
			},
		};

		return {
			response: tool,
		};
	}
}
