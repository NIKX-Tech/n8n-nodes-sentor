import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    Icon,
} from 'n8n-workflow';

export class GoogleGeminiApi implements ICredentialType {
    name = 'googleGeminiApi';
    displayName = 'Google Gemini API';
    icon: Icon = 'fa:key';
    documentationUrl = 'https://ai.google.dev/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'The API key for Google Gemini.',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'X-Google-API-Key': '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://generativelanguage.googleapis.com',
            url: '/v1beta/models',
            headers: {
                'x-goog-api-key': '={{$credentials.apiKey}}',
            },
        },
    };
}
