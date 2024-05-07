import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { returnBinary } from '../../methods/returnBinary';
// import { binaryNameParameter, fileNameParameter } from '../shared/parameters';

const defaultText =
	'Digital Wisdom is the subtle art of cutting through bullshit tasks so we can focus on what truly matters and bring value to the world.';
const defaultAccentStrength = 1;

/* Operation */
export const generateVoiceOperation: INodePropertyOptions = {
	name: 'Generate Voice',
	value: 'generate-voice',
	action: 'Generates a new voice',
	description: 'Generates a new unique random voice based on parameters',
	routing: {
		request: {
			method: 'POST',
			encoding: 'arraybuffer',
			returnFullResponse: true,
			url: '={{"/voice-generation/generate-voice"}}',
			body: {
				age: '={{$parameter["age"]}}',
				gender: '={{$parameter["gender"]}}',
				accent: '={{$parameter["accent"]}}',
				accent_strength: `={{$parameter["additionalFields"]["accent_strength"] || ${defaultAccentStrength}}}`,
				text: `={{$parameter["additionalFields"]["text"] || "${defaultText}" }}`,
			},
		},
		output: {
			postReceive: [
				returnBinary,
				async function (this, items, responseData) {
					return items.map((item) => ({
						...item,
						json: {
							generated_voice_id: responseData.headers.generated_voice_id,
							age: this.getNodeParameter('age'),
							gender: this.getNodeParameter('gender'),
							accent: this.getNodeParameter('accent'),
							accent_strength: this.getNodeParameter(
								'additionalFields.accent_strength',
								defaultAccentStrength,
							),
						},
					}));
				},
			],
		},
	},
};

const displayOptions = {
	show: {
		operation: ['generate-voice'],
	},
};

/* Parameters */
export const generateVoiceParameters: INodeProperties[] = [
	// Notice
	{
		displayName:
			'This generates a voice and returns a generated_voice_id with an audio sample. If you like the generated voice call "Create Voice" with the generated_voice_id to create the voice.',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions,
	},
	// Gender
	{
		displayName: 'Gender Name or ID',
		description:
			'The gender of the speaker. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		required: true,
		name: 'gender',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'listVoiceGenders',
		},
		default: '',
		displayOptions,
	},
	// Accent
	{
		displayName: 'Accent Name or ID',
		description:
			'The accent of the speaker. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		required: true,
		name: 'accent',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'listVoiceAccents',
		},
		default: '',
		displayOptions,
	},
	// Age
	{
		displayName: 'Age Name or ID',
		description:
			'The age of the speaker. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		required: true,
		name: 'age',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'listVoiceAges',
		},
		default: '',
		displayOptions,
	},
	/* Additional fields */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Fields',
		displayOptions,
		options: [
			{
				displayName: 'Binary Name',
				description: 'Change the output binary name',
				name: 'binary_name',
				type: 'string',
				default: 'data',
			},
			{
				displayName: 'File Name',
				description: 'Change the output file name',
				name: 'file_name',
				type: 'string',
				default: 'voice',
			},
			// Text
			{
				displayName: 'Sample Text',
				description: 'Default text to sample',
				name: 'text',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: defaultText,
			},
			// Accent Strength
			{
				displayName: 'Accent Strength',
				required: true,
				name: 'accent_strength',
				type: 'number',
				typeOptions: {
					maxValue: 2,
					minValue: 0.3,
					numberStepSize: 0.1,
				},
				default: defaultAccentStrength,
			},
		],
	},
];