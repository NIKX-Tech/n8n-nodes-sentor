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
			description: 'The API key to authenticate with Sentor ML API. Get your API key from <a href="https://dashboard.sentor.app" target="_blank">sentor.app</a>.',
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

	// Credential test using the health check endpoint
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://sentor.app/api',
			url: '/health',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'API key is valid',
					key: 'status',
					value: 'healthy',
				},
			},
		],
	};
}

