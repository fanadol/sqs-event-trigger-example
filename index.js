const AWS = require('aws-sdk');

module.exports.senderHandler = async event => {
	resp = await sendMessage('blah');
	return {
		statusCode: 200,
		body: JSON.stringify(resp),
	};
};

module.exports.workerHandler = async event => {
	const sqs = new AWS.SQS();
	// All messages can be access from event.Records
	const body = event.Records[0].body;
	console.log('body: ', body);
	// Do something
	var params = {
		QueueUrl: 'YOUR_QUEUE_URL',
		ReceiptHandle: event.Records[0].receiptHandle,
	};
	// Delete message after finish the task
	await sqs.deleteMessage(params).promise();
	return {
		statusCode: 200,
		body: JSON.stringify({
			data: body,
		}),
	};
};

async function sendMessage(message) {
	const sqs = new AWS.SQS();
	// Message that you want to send into queue
	const payload = JSON.stringify({
		status: 'OK',
		message: 'Some message that',
	});
	const params = {
		MessageBody: payload,
		QueueUrl: 'YOUR_QUEUE_URL',
	};
	resp = await sqs.sendMessage(params).promise();
	return resp;
}
