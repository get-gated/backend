# GCP Project Configuration

This document outlines how to configure a GCP project for use by the backend API. 

# Google Oauth

To make this process easier, you may want to consider logging out of any other google accounts you might be signed in with.

## Select Project

1. Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Select the desired GCP Project

## Consent Screen

1. Navigate to [https://console.cloud.google.com/apis/credentials/consent](https://console.cloud.google.com/apis/credentials/consent)
2. Choose External and click Create
    
    ![Screenshot from 2022-06-08 06-17-21.png](images/Screenshot_from_2022-06-08_06-17-21.png)
    
3. Enter the App Name the same as Project Name, and select a User Support Email
    
    ![Screenshot from 2022-06-08 06-22-59.png](images/Screenshot_from_2022-06-08_06-22-59.png)
    
4. Enter `gated-dev-name.firebaseapp.com`  as an Authorized Domain and a Developer Email
    
    ![Screenshot from 2022-06-08 06-25-11.png](images/Screenshot_from_2022-06-08_06-25-11.png)
    
5. Click Save and Continue and then Add or Remove Scopes
    
    ![Screenshot from 2022-06-08 06-29-08.png](images/Screenshot_from_2022-06-08_06-29-08.png)
    
6. Add scopes
    1. Paste the following text in the Manually Add Scopes box
        
        ```
        [openid](https://www.googleapis.com/openid), [https://www.googleapis.com/auth/userinfo.profile](https://www.googleapis.com/auth/userinfo.profile), [https://www.googleapis.com/auth/gmail.modify](https://www.googleapis.com/auth/gmail.modify)
        ```
        
    2. Click Add to Table, then Update, then Save and Continue
        
        ![Screenshot from 2022-06-08 06-37-31.png](images/Screenshot_from_2022-06-08_06-37-31.png)
        
7. Click Add Users and enter the emails that will be able to sign up on your local environment
    
    ![Screenshot from 2022-06-08 06-46-19.png](images/Screenshot_from_2022-06-08_06-46-19.png)
    

## Oauth Client ID and Secret

1. Navigate to [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Click Create Credentials > OAuth Client ID
    
    ![Screenshot from 2022-06-08 06-48-50.png](images/Screenshot_from_2022-06-08_06-48-50.png)
    
3. Select “Web application” as the Application Type and enter your Project Name as the Name
    
    ![Screenshot from 2022-06-08 06-52-16.png](images/Screenshot_from_2022-06-08_06-52-16.png)
    
4. Enter the following as an Authorized JavaScript Origin:
`http://localhost:8080`
    
    ![Screenshot from 2022-06-08 06-54-58.png](images/Screenshot_from_2022-06-08_06-54-58.png)
    
5. Enter the following Authorized Redirect URIs and click Save:
`http://localhost:3000/api/user/auth/login`
`http://localhost:3000/api/user/auth/migration`
`http://localhost:3000/api/user/auth/signup`
`http://localhost:3000/api/connection/reauthorize`‪
    
    ![Screenshot from 2022-06-10 05-51-16.png](images/Screenshot_from_2022-06-10_05-51-16.png)
    
6. Copy the Client ID and Secret to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`  in .env
    
    ![Screenshot from 2022-06-08 07-03-35.png](images/Screenshot_from_2022-06-08_07-03-35.png)
    

## Key Ring

1. Follow the [Enable the KMS API](https://console.cloud.google.com/flows/enableapi?apiid=cloudkms.googleapis.com&redirect=https://console.cloud.google.com/security/kms/keyrings) flow
    
    ![Screenshot from 2022-06-08 07-58-13.png](images/Screenshot_from_2022-06-08_07-58-13.png)
    
    <aside>
    ⚠️ If you are prompted to enable billing, reach out to an administrator to enable billing for your project.
    
    </aside>
    
2. Navigate to [https://console.cloud.google.com/security/kms/keyrings](https://console.cloud.google.com/security/kms/keyrings)
3. Click Create Key Ring
    1. Enter a Key Ring Name e.g. “keyring”
    2. Ensure the Locaiton is “Multi-region” > "global (Global)”, which is the default
    3. Click Create
    
    ![Screenshot from 2022-06-08 08-02-06.png](images/Screenshot_from_2022-06-08_08-02-06.png)
    
4. Create Key
    1. Enter a Key Name e.g. “development”
    2. Select Key Rotation Period “Never (manual rotation)”
    3. Click Create
    
    ![Screenshot from 2022-06-08 08-12-21.png](images/Screenshot_from_2022-06-08_08-12-21.png)
    

## Tenant

<aside>
⚠️ You may need to enable Identity Platform as well as allow multi-tenancy under security settings under Identity Platform.

</aside>

1. Navigate to [https://console.cloud.google.com/customer-identity/tenants](https://console.cloud.google.com/customer-identity/tenants)
2. Click Add Tenant
    1. Enter a Tenant Name, e.g. “gated-dev”
    2. Click Save
        
        ![Screenshot from 2022-06-08 08-24-01.png](images/Screenshot_from_2022-06-08_08-24-01.png)
        
3. Set the `AUTH_TENANT` in .env, e.g. `AUTH_TENANT=gated-dev-asdf1`
    
    ![Screenshot from 2022-06-08 08-28-27.png](images/Screenshot_from_2022-06-08_08-28-27.png)
    
4. Add identity provider for Googlei

## Service Account

1. Navigate to [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Click Create Credentials > Service Account
    
    ![Screenshot from 2022-06-08 07-10-41.png](images/Screenshot_from_2022-06-08_07-10-41.png)
    
3. Enter the Project Name as the Service Account Name and click Create and Continue
    
    ![Screenshot from 2022-06-08 07-13-18.png](images/Screenshot_from_2022-06-08_07-13-18.png)
    
4. Click Continue and Done to return to [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
5. Click the pencil icon to edit the service account
    
    ![Screenshot from 2022-06-08 07-48-00.png](images/Screenshot_from_2022-06-08_07-48-00.png)
    
6. Click Keys > Add Key > Create New Key 
    
    ![Screenshot from 2022-06-08 07-49-51.png](images/Screenshot_from_2022-06-08_07-49-51.png)
    
7. Select JSON and click Create
    
    ![Screenshot from 2022-06-08 07-52-33.png](images/Screenshot_from_2022-06-08_07-52-33.png)
    
8. Save the .json file
9. Duplicate the file into the nestjs folder and rename it to cred.json
10. In the .env file, update `GOOGLE_APPLICATION_CREDENTIALS` to the full path of cred.json
e.g. `GOOGLE_APPLICATION_CREDENTIALS=/home/name/workspace/nestjs/cred.json`

## Add Security Principal For Service Account

1. Go to IAM
2. Select Permissions then click +Add
3. Start typing name of services client name like ‘gated-dev-name’. Auto-completion should show your list of services clients. Select your client.

![Screen Shot 2022-09-13 at 2.56.22 PM.png](images/Screen_Shot_2022-09-13_at_2.56.22_PM.png)

1. Select roles:  `Owner` and `Pub/Sub Edit`
2. you should have a new ‘principal’ listed

![Screen Shot 2022-09-13 at 2.58.24 PM.png](images/Screen_Shot_2022-09-13_at_2.58.24_PM.png)


## Allow for Full Email Flow (Optional)

If you’d like to enable the entire email flow from your local, gmail api needs to be allowed to push notifications to our gmail-push-notifications topic. To do that

1. open the settings for the topic in the google console.
2. view “Permissions” on the right hand tab
3. Click “+ADD PRINCIPAL”
4. for “New principal”, enter [gmail-api-push@system.gserviceaccount.com](mailto:gmail-api-push@system.gserviceaccount.com) 
    1. this is a special principal that gmail uses 
5. assign pub/sub publisher role