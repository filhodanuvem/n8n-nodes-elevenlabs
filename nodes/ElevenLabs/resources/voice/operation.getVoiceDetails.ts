import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { voiceIdParameter } from '../shared/parameters';

/* Operation */
export const getVoiceDetailsOperation: INodePropertyOptions = {
	name: 'Get Voice Details',
	value: 'get-voice-details',
	action: 'Returns voice details',
	description: 'Returns all details about one voice',
	routing: {
		request: {
			method: 'GET',
			url: '={{"/voices/"  + $parameter["voice_id"] }}',
			qs: {
				with_settings: '={{$parameter["with_settings"]}}',
			},
		},
	},
};

const displayOptions = {
	show: {
		operation: ['get-voice-details'],
	},
};

/* Parameters */
export const getVoiceDetailsParameters: INodeProperties[] = [
	{
		...voiceIdParameter,
		displayOptions,
	},
	{
		displayName: 'With Settings',
		name: 'with_settings',
		type: 'boolean',
		default: false,
		description: 'Whether returns voice settings',
		displayOptions,
	},
];
