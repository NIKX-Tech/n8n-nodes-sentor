import type {
	IAuthenticateGeneric,
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
			description: 'The API key to authenticate with Sentor ML API. Get your API key from <a href="https://sentor.app" target="_blank">sentor.app</a>. The credentials will be validated when you use the node.',
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

	// Note: No credential test to avoid consuming user's API rate limits
	// Authentication will be validated when the node is actually used
}

