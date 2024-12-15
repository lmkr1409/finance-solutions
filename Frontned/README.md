## App intialization issue

- First run cmd as admin and then reset cache
  > npm start --reset-cache
- Now check for doctor
  > npx react-native doctor
- Now run app

  > npx react-native run-android

- While doing reset-cache then you can run below command in power shell admin mode

  > Get-Process -Id (Get-NetTCPConnection -LocalPort YourPortNumberHere).OwningProcess

  > taskkill /PID <pid>
