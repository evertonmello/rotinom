export async function setUpServiceWorker(publicKey, token, userId){
    console.log( window.plugins.OneSignal)
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        //START ONESIGNAL CODE
    //Remove this method to stop OneSignal Debugging 
    window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
    
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    // Set your iOS Settings
    var iosSettings = {};
    iosSettings["kOSSettingsKeyAutoPrompt"] = false;
    iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
    
    window.plugins.OneSignal
      .startInit("d47daf44-82d3-4da7-81fd-e1754ecd431f")
      .handleNotificationOpened(notificationOpenedCallback)
      .iOSSettings(iosSettings)
      .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
      .endInit();
    
    // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
      console.log("User accepted notifications: " + accepted);
    });

    window.plugins.OneSignal.setExternalUserId(userId, (res)=>{
    },(res)=>{
      console.log(res)
    })
}



async function send(publicKey, token,userId) {
  console.log("utils Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered....");
  await navigator.serviceWorker.ready;  // <---------- WAIT 

  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });
  console.log(subscription)
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  var p256dh = arrayBufferToBase64(subscription.getKey("p256dh"));
  var auth = arrayBufferToBase64(subscription.getKey("auth"));
  await fetch("https://backend.monitor.mottu.com.br/api/v1/Push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      client: userId,
      endpoint: subscription.endpoint, 
      p256dh: p256dh,
      auth:auth
    }),
    headers: {
      "content-type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
  console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}