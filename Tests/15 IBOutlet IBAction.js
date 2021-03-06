
//	JSCocoaController.sharedController.evalJSFile(NSBundle.mainBundle.bundlePath + '/Contents/Resources/class.js')


	var messageFromAction = null

//	defineClass('MyButtonTestingOutletAction < NSButton')


	defineClass('MyButtonTestingOutletAction < NSButton', 
	{
		'setState:' : 
						function(sel, object)
						{
							var r = this.Super(arguments)
//							JSCocoaController.log('perform ' + sel + ' object=' + object)
							testInstanceOverload = true
							return	r
						}
		,'myAction1' : ['IBAction', 
						function (sender)
						{
//							JSCocoaController.log('Action1 ! ' + this.myOutlet1)
							messageFromAction = 'myAction1'
						}]
		,'myAction2' : ['IBAction', 
						function (sender)
						{
//							JSCocoaController.log('Action2 ! ' + this.myOutlet2)
							messageFromAction = 'myAction2'
						}]
		,'myAction3' : ['IBAction', 
						function (sender)
						{
//							JSCocoaController.log('Action3 ! ' + this.myOutlet3)
							messageFromAction = 'myAction3'
						}]
		,'myOutlet1' : 'IBOutlet'
		,'myOutlet2' : 'IBOutlet'
		,'myOutlet3' : 'IBOutlet'
	})

	defineClass('NibTestOwner < NSObject',
	{
		 'window'	: 'IBOutlet'
		,'button'	: 'IBOutlet'
		,'input1'	: 'IBOutlet'
		,'input2'	: 'IBOutlet'
		,'myValue'	: 'Key'
	})

	
	var path = NSBundle.mainBundle.bundlePath + '/Contents/Resources/Tests/Resources/standalone window.nib'
//	log('path=' + path)
//	var path = 'Tests/Resources/standalone window'
//	var path = 'Tests/Resources/standalone window'
//	var path = 'standalone window'
	
	// Does not work ... why ? loadNibNamed:owner: is defined in a category, does not appear in class_copyMethodList
//	var nib = NSBundle.loadNib({ named : path, owner : o })

	// This will be the NIB's owner, it will receive some outlets
	var owner = NibTestOwner.instance
//	var nib = NSBundle.loadNibNamed_owner_(path, owner)

	// loadNibNamed does not allow path data, load nib with NSNib
	var nib = NSNib.instance({withContentsOfURL:NSURL.fileURLWithPath(path)})
	if (!nib.instantiateNibWithOwner_topLevelObjects(owner, null))	throw 'NIB not loaded ' + path
//log('r=' + owner.button['class'])

	// Check if outlets are connected
	if (owner.window['class'] != 'NSWindow')					throw 'window IBOutlet not connected'
	if (owner.button['class'] != 'MyButtonTestingOutletAction')	throw 'button IBOutlet not connected'

	if (owner.button.myOutlet1.title != 'ButtonOutletTest1')	throw 'button1 IBOutlet not connected'
	if (owner.button.myOutlet2.title != 'ButtonOutletTest2')	throw 'button2 IBOutlet not connected'
	if (owner.button.myOutlet3.title != 'ButtonOutletTest3')	throw 'button3 IBOutlet not connected'

	
	// Check if actions are connected - use perform click
	owner.button.myOutlet1.performClick(null)
	if (messageFromAction != 'myAction1')						throw 'action1 IBAction not connected'
	owner.button.myOutlet2.performClick(null)
	if (messageFromAction != 'myAction2')						throw 'action2 IBAction not connected'
	owner.button.myOutlet3.performClick(null)
	if (messageFromAction != 'myAction3')						throw 'action3 IBAction not connected'

	
	// Change window title and check we get it back OK
	var 이름 = 'helloéworld'
	var 이름 = '오늘의 추천'
	owner.window.title = 이름
	if (owner.window.title != 이름)								throw 'window title not changed'
	

//	JSCocoaController.log('owner.window.title=' + owner.window.title)



	//
	//	Bindings test
	//	PROBLEM : upon second call, fails in valueForKey, calling and old closure ([owner myValue] ?)
	//	-> only test once.
	//
	if (!('bindingsAlreadyTested' in this))
	{

		// Test bindings
		var λέξη1 = 'εξόρυξης'
		var λέξη2 = 'χρυσού'
		owner.set({ value : λέξη1, forKey : 'myValue' })
		
		// Bind model (owner.myValue) to view (input1.value)
		// This will copy model value to view value
		owner.input1.bind({ '' : 'value', toObject : owner, withKeyPath : 'myValue', options : null})

		// Check that view value did reflect initial model value
		if (owner.input1.stringValue != λέξη1)	throw 'binding : initial binding failed'
		
		// Change model value
		owner.set({ value : λέξη2, forKey : 'myValue' })


		// Check that view value did reflect new model value
		if (owner.input1.stringValue != λέξη2)	throw 'binding : update dispatch failed'
		
		// Unbind
//		JSCocoaController.log('bindingInfo=' + owner.input1.infoForBinding('value'))
		owner.input1.unbind('value')
//		JSCocoaController.log('bindingInfo=' + owner.input1.infoForBinding('value'))
		
	}
	else
	{
		JSCocoaController.log('(skipping bindings test)')
	}
	bindingsAlreadyTested = true
	
	// Hide window
	owner.window.orderOut(null)
	

//	JSCocoaController.log('contentView=' + owner.window.contentView)
//	JSCocoaController.log('styleMask=' + owner.window.styleMask)
//	JSCocoaController.log('frame=' + owner.window.frame.origin.x)

	
	//
	//	NIB's root objects stick around. ##TOCHECK
	//	As bundles cannot be unloaded, I suppose it's normal ?
	//
	//	... manually releasing the window works.
	//

	owner.window.release
	owner = null
	JSCocoaController.garbageCollect

	nib = null
	JSCocoaController.garbageCollect


