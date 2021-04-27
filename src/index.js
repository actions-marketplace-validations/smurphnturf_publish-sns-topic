const core = require('@actions/core');
const AWS = require('aws-sdk');

function execute() {
  try{
    const AWS_REGION = core.getInput("AWS_REGION") || process.env.AWS_REGION;
    const AWS_ACCESS_KEY_ID = core.getInput("AWS_ACCESS_KEY_ID") || process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = core.getInput("AWS_SECRET_ACCESS_KEY") || process.env.AWS_SECRET_ACCESS_KEY;
    const AWS_SESSION_TOKEN = core.getInput("AWS_SESSION_TOKEN") || process.env.AWS_SESSION_TOKEN;
    
    const MESSAGE = core.getInput("MESSAGE");
    const TOPIC_ARN = core.getInput("TOPIC_ARN");

    AWS.config.update({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN
    });

    core.info(MESSAGE);
    
    const STRINGIFIED_MESSAGE = JSON.stringify(MESSAGE);
    core.info(STRINGIFIED_MESSAGE);
    const params = {
      Message: STRINGIFIED_MESSAGE,
      TopicArn: TOPIC_ARN
    };

    const awsClient = new AWS.SNS({ apiVersion: "2010-03-31" });

    awsClient.publish(params, function(err, data) {
      if (err) {
        core.error(err.Message);
        core.setFailed(err.Message); 
      }
      else {
        core.info("Published Topic Sent!");
        return data.MessageId;
      }
    });
  }catch(error) {
    core.error(err.Message);
    core.setFailed(error.message);
  }
}

execute();