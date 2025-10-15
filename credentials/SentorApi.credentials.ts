import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SentorApi implements ICredentialType {
	name = 'sentorApi';
	displayName = 'Sentor API';
	documentationUrl = 'https://sentor.app/docs/#/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key to authenticate with Sentor ML API',
		},
	];

	// Use generic authentication to add the API key to the x-api-key header
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Test the credentials by making a request to the API
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://sentor.app',
			url: '/api/predicts',
			method: 'POST',
			body: {
				docs: [
					{
						doc: 'Test',
						doc_id: 'test_credential',
					},
				],
			},
		},
	};
}

