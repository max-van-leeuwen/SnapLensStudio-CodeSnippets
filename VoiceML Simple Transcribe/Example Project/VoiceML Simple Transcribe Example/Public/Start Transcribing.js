global.startVoiceMLTranscribe(callback);

function callback(eventArgs){
    // intermediate transcription
    if(eventArgs.transcription.trim() == "") return;
    print(eventArgs.transcription);

    // final transcription
    if(!eventArgs.isFinalTranscription) return;
    print("Final Transcription: " + eventArgs.transcription);
}