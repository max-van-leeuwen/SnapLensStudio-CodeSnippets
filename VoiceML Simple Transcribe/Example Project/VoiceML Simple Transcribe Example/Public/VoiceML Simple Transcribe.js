// Max van Leeuwen
//
// Simple audio transcribing setup.
// Results are sent to the 'overheard' function (which prints it to the logger panel).



//@ui {"widget":"label"}
//@input Asset.VoiceMLModule vmlModule



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
}



function overheard(eventArgs){
	// intermediate transcription
	if(eventArgs.transcription.trim() == "") return;
	print(eventArgs.transcription);

	// final transcription
	if(eventArgs.isFinalTranscription) print("Final Transcription: " + eventArgs.transcription);
}



start();