import type {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class GoogleGeminiApi implements ICredentialType {
    name = 'googleGeminiApi';
    displayName = 'Google Gemini API';
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
}
