// Max van Leeuwen
//
// Simple audio transcribing module, call global.VoiceMLTranscribe.start().
// Results are sent to the 'overheard' function, which prints it to the logger panel.



global.VoiceMLTranscribe = script.api;
script.api.start = start;



//@ui {"widget":"label"}
//@input Asset.VoiceMLModule vmlModule

//@ui {"widget":"label"}
//@input string[] boosts
//@input float boostsAmount {"min":1, "max":10}



function start(){
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
		overheard(eventArgs);
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



function overheard(eventArgs){
	// intermediate transcription
	if(eventArgs.transcription.trim() == "") return;
	print(eventArgs.transcription);

	// final transcription
	if(!eventArgs.isFinalTranscription) return;
	print("Final Transcription: " + eventArgs.transcription);
}