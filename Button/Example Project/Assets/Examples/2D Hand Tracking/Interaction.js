//@input Component.Script button1
//@input Component.Script button2
//@input Component.Image image1
//@input Component.Image image2


// on press, change button color
script.button1.onPress.add(function(){
    script.image1.mainPass.isPressed = true;
    script.image2.mainPass.isPressed = false;
    print('button 1 pressed!');
})
script.button2.onPress.add(function(){
    script.image1.mainPass.isPressed = false;
    script.image2.mainPass.isPressed = true;
    print('button 1 pressed!');
})


// print counter amount (when hand is hovering over button)
script.button1.counterValueAnim.add(function(v){
    if(v) print('button 1 counter value: ' + v);
});
script.button2.counterValueAnim.add(function(v){
    if(v) print('button 2 counter value: ' + v);
});