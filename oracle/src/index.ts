//import faker from 'faker';
import { TestCase } from './testCaseGenerator.js';
import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';
import csv from 'csv-parser';
import fs from 'fs';

/*------------------------------------------------------------------------------------------------------------------------*/
/*A. USING AUTOMATICALLY GENERATED TEST CASE*/

const testCase = new TestCase();

const exampleTest = async (): Promise<void> => {
  const driver = await new Builder().forBrowser('chrome').build();

  //1.1 TEST-1 LOADING THE HOME PAGE
  await driver.get('https://www.booking.com');
  //1.2 TEST-1 RESULT CHECKING (TEST ORACLE)
  try {
      /*Check the title*/
      await driver.wait(until.titleIs(
        'Booking.com | Official site | The best hotels & accommodations'), 5000);
      /*Check whether the Destination input box is located*/
      await driver.wait(until.elementLocated(By.name('ss')));
      /*Check whether the Checkin and Checkout dates input box is located*/
      await driver.wait(until.elementLocated(By.className('xp__dates-inner')));
      /*Check whether the Guest details input box is located*/
      await driver.wait(until.elementLocated(By.className('xp__input')));
      /*Check whether the Search button is located*/
      await driver.wait(until.elementLocated(By.className('sb-searchbox__button')));

      console.log('Test-1 Result: Passed! The page is loaded successfully');
  } catch (e) {
    console.log('Test-1 Result: Failed! The page is not loaded successfully');
  }

  //2.1 TEST-2 ENTERING TEST CASE
  //2.1.1 Enter the destination name
  const destinationInput = testCase.generateDestinationName();
  await driver.findElement(By.name('ss')).sendKeys(destinationInput);
  
  //2.1.2 Enter the checkin and checkout dates
  await driver.findElement(By.className("xp__dates-inner")).click();//Click dates box
  const checkin = testCase.generateDates().checkinDateInput;
  const checkout = testCase.generateDates().checkoutDateInput;
  await driver.findElement(By.css("td.bui-calendar__date[data-date='"+checkin+"']")).click();//checkin
  await driver.findElement(By.css("td.bui-calendar__date[data-date='"+checkout+"']")).click();//checkout
  
  //2.1.3 Enter the guest details (automated case?)
  await driver.findElement(By.className("xp__input")).click();//Click the guest details box

  //2.1.3.1 No of Adults
  const noOfAdults = testCase.generateNoOfAdults();
  const defaultAdults = 2;

  if (noOfAdults < defaultAdults) {
      await driver.findElement(By.css("button[aria-label='Decrease number of Adults']")).click();
  } else if (noOfAdults > defaultAdults) {
      let i;
      for (i = 0; i < noOfAdults-2; i++) {
          await driver.findElement(By.css("button[aria-label='Increase number of Adults']")).click();
      }
  }

  //2.1.3.2 No of Children
  const noOfChildren = testCase.generateNoOfChildren();
  const defaultChildren = 0;

  if(noOfChildren > defaultChildren){
      let i;
      for (i = 0; i < noOfChildren; i++) {
          await driver.findElement(By.css("button[aria-label='Increase number of Children']")).click();
      }
  }

  //2.1.3.3 No of Rooms
  //Left as one room because Booking.com will advise the number of rooms automatically depending on the guest numbers
  //await driver.findElement(By.css("button[aria-label='Increase number of Rooms']")).click();//automated click for + rooms
  //await driver.findElement(By.css("button[aria-label='Decrease number of Rooms']")).click();//automated click for - rooms

  //2.1.4 Click Search button
  await driver.findElement(By.className("sb-searchbox__button")).click();


  //2.2 TEST-2 RESULT CHECKING (TEST ORACLE, maybe test more)
  try {
      /*Check the title of the page*/
      await driver.wait(until.titleContains(destinationInput), 5000);
      /*Check whether the search box is displayed*/
      await driver.wait(until.elementLocated(By.css('form#frm.sb-searchbox.sb-face-lift.sb-searchbox--painted.-small.js--sb-searchbox')));
      /*Check whether the no of adults match with the inputted no of adults*/
      await driver.wait(until.elementLocated(By.css("option[value='"+noOfAdults+"'][selected='selected']")));
      /*Check whether the no of children match with the inputted no of children*/
      await driver.wait(until.elementLocated(By.css("option[value='"+noOfChildren+"'][selected='selected']")));
      /*Check whether the filter box is displayed*/
      await driver.wait(until.elementLocated(By.css('div.filterbox_options_content')));
      /*Check whether the hotel list is displayed*/
      await driver.wait(until.elementLocated(By.css('div#hotellist_inner.wider_image')));

      console.log("Test-2 Result: Passed! Successfully load hotels in "+destinationInput);
  } catch (e) {
      console.log("Test-2 Result: Failed! Failed to load hotels in "+destinationInput);
  }

  //console.log(destinationInput,checkin,checkout,noOfAdults,noOfChildren);
    // await driver.quit();
};

//exampleTest();//UNCOMMENT IF YOU WANT TO RUN THE TEST WITH AUTOMATED TEST CASE GENERATOR







/*------------------------------------------------------------------------------------------------------------------------*/
/*B. USING THE PRE-GENERATED TEST CASE*/

const csvData = [] as any;
//Read the pre-generated test data from csv file
fs.createReadStream('src/preGeneratedTestData.csv')
    .pipe(csv())
    .on('data', (data) => csvData.push(data))
    .on('end', () => {
        const exampleTestFromCSV = async (): Promise<void> => {
            const driver = await new Builder().forBrowser('chrome').build();

            //1.1 TEST-1 LOADING THE HOME PAGE
            await driver.get('https://www.booking.com');
            //1.2 TEST-1 RESULT CHECKING (TEST ORACLE)
            try {
                /*Check the title*/
                await driver.wait(until.titleIs(
                    'Booking.com | Official site | The best hotels & accommodations'), 5000);
                /*Check whether the Destination input box is located*/
                await driver.wait(until.elementLocated(By.name('ss')));
                /*Check whether the Checkin and Checkout dates input box is located*/
                await driver.wait(until.elementLocated(By.className('xp__dates-inner')));
                /*Check whether the Guest details input box is located*/
                await driver.wait(until.elementLocated(By.className('xp__input')));
                /*Check whether the Search button is located*/
                await driver.wait(until.elementLocated(By.className('sb-searchbox__button')));

                console.log('Test-1 Result: Passed! The page is loaded successfully');
            } catch (e) {
                console.log('Test-1 Result: Failed! The page is not loaded successfully');
            }

            //2.1 TEST-2 ENTERING TEST CASE
            //const randomIndex = Math.floor((Math.random()*9));//Random index to pick data from pre-generated csv file
            const randomIndex = 1;

            //2.1.1 Enter the destination name
            const destinationInput = csvData[randomIndex]['Destination'];
            await driver.findElement(By.name('ss')).sendKeys(destinationInput);

            //2.1.2 Enter the checkin and checkout dates
            await driver.findElement(By.className("xp__dates-inner")).click();//Click dates box
            const checkin = csvData[randomIndex]['Checkin'];
            const checkout = csvData[randomIndex]['Checkout'];
            await driver.findElement(By.css("td.bui-calendar__date[data-date='"+checkin+"']")).click();//checkin
            await driver.findElement(By.css("td.bui-calendar__date[data-date='"+checkout+"']")).click();//checkout

            //2.1.3 Enter the guest details (automated case?)
            await driver.findElement(By.className("xp__input")).click();//Click the guest details box

            //2.1.3.1 No of Adults
            const noOfAdults = Number (csvData[randomIndex]['NoOfAdults']);
            const defaultAdults = 2;

            if (noOfAdults < defaultAdults) {
                await driver.findElement(By.css("button[aria-label='Decrease number of Adults']")).click();
            } else if (noOfAdults > defaultAdults) {
                let i;
                for (i = 0; i < noOfAdults-2; i++) {
                    await driver.findElement(By.css("button[aria-label='Increase number of Adults']")).click();
                }
            }

            //2.1.3.2 No of Children
            const noOfChildren = Number (csvData[randomIndex]['NoOfChildren']);
            const defaultChildren = 0;

            if(noOfChildren > defaultChildren){
                let i;
                for (i = 0; i < noOfChildren; i++) {
                    await driver.findElement(By.css("button[aria-label='Increase number of Children']")).click();
                }
            }

            //2.1.3.3 No of Rooms
            //Left as one room because Booking.com will advise the number of rooms automatically depending on the guest numbers
            //await driver.findElement(By.css("button[aria-label='Increase number of Rooms']")).click();//automated click for + rooms
            //await driver.findElement(By.css("button[aria-label='Decrease number of Rooms']")).click();//automated click for - rooms

            //2.1.4 Click Search button
            await driver.findElement(By.className("sb-searchbox__button")).click();

            //2.2 TEST-2 RESULT CHECKING (TEST ORACLE, maybe test more)
            try {
                /*Check the title of the page*/
                await driver.wait(until.titleContains(destinationInput), 5000);
                /*Check whether the search box is displayed*/
                await driver.wait(until.elementLocated(By.css('form#frm.sb-searchbox.sb-face-lift.sb-searchbox--painted.-small.js--sb-searchbox')));
                /*Check whether the no of adults match with the inputted no of adults*/
                await driver.wait(until.elementLocated(By.css("option[value='"+noOfAdults+"'][selected='selected']")));
                /*Check whether the no of children match with the inputted no of children*/
                await driver.wait(until.elementLocated(By.css("option[value='"+noOfChildren+"'][selected='selected']")));
                /*Check whether the filter box is displayed*/
                await driver.wait(until.elementLocated(By.css('div.filterbox_options_content')));
                /*Check whether the hotel list is displayed*/
                await driver.wait(until.elementLocated(By.css('div#hotellist_inner.wider_image')));

                console.log("Test-2 Result: Passed! Successfully load hotels in "+destinationInput);
            } catch (e) {
                console.log("Test-2 Result: Failed! Failed to load hotels in "+destinationInput);
            }
            //await driver.quit();
        };
        exampleTestFromCSV();//UNCOMMENT IF YOU WANT TO RUN THE TEST WITH PRE-GENERATED TEST CASE
    });



