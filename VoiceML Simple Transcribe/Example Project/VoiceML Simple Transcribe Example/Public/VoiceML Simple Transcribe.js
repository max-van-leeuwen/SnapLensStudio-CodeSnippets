// Max van Leeuwen
//
// Simple audio transcribing module, call
// 	global.startVoiceMLTranscribe(<callback function>).
//
// Results are sent to the given callback function. If none was given, the following example will be used:

function exampleCallback(eventArgs){
	// intermediate transcription
	if(eventArgs.transcription.trim() == "") return;
	print(eventArgs.transcription);

	// final transcription
	if(!eventArgs.isFinalTranscription) return;
	print("Final Transcription: " + eventArgs.transcription);
}



//@ui {"widget":"label"}
//@input Asset.VoiceMLModule vmlModule

//@ui {"widget":"label"}
//@input string[] boosts
//@input float boostsAmount {"min":1, "max":10}



global.startVoiceMLTranscribe = function(callback){
	if(!callback) callback = exampleCallback;

	var options = VoiceML.ListeningOptions.create();

	var onListeningEnabledHandler = function(){
		script.vmlModule.startListening(options);
	};

	var onListeningDisabledHandler = function(){
		script.vmlModule.stopListening();
	};

	var onListeningErrorHandler = function(eventErrorArgs){
		print("VoiceML error: " + eventErrorArgs.error + " desc: "+ eventErrorArgs.description);
	};

	var onUpdateListeningEventHandler = function(eventArgs) {
		callback(eventArgs);
	};

	script.vmlModule.onListeningUpdate.add(onUpdateListeningEventHandler);
	script.vmlModule.onListeningError.add(onListeningErrorHandler);
	script.vmlModule.onListeningEnabled.add(onListeningEnabledHandler);
	script.vmlModule.onListeningDisabled.add(onListeningDisabledHandler);

	options.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default;
	options.shouldReturnAsrTranscription = true;

	var sanitizedBoosts = [];
	for(var i = 0; i < script.boosts.length; i++){
		var thisBoost = script.boosts[i];
		if(thisBoost.length === 0) continue;
		sanitizedBoosts.push(thisBoost.toLowerCase());
	}
	if(sanitizedBoosts.length != 0) options.addSpeechContext(sanitizedBoosts, script.boostsAmount);
}