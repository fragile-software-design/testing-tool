//import faker from 'faker';
import { TestCase } from './testCaseGenerator.js';
import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';

const testCase = new TestCase();

const exampleTest = async (): Promise<void> => {
  const driver = await new Builder().forBrowser('chrome').build();

  //************************************************************************************************************************
  //1.1 TEST-1 LOADING THE HOME PAGE
  await driver.get('https://www.booking.com');
  //1.2 TEST-1 RESULT CHECKING (TEST ORACLE)
  try {
    await driver.wait(
      until.titleIs(
        'Booking.com | Official site | The best hotels & accommodations'
      ),
      5000
    ); //Check the Title
    await driver.wait(until.elementLocated(By.name('ss'))); //Check whether the Destination input box is located
    await driver.wait(until.elementLocated(By.className('xp__dates-inner'))); //Check whether the Checkin and Checkout dates input box is located
    await driver.wait(until.elementLocated(By.className('xp__input'))); //Check whether the Guest details input box is located
    await driver.wait(
      until.elementLocated(By.className('sb-searchbox__button'))
    ); //Check whether the Search button is located

    console.log('Test-1 Result: Passed! The page is loaded successfully');
  } catch (e) {
    console.log('Test-1 Result: Failed! The page is not loaded successfully');
  }

  //************************************************************************************************************************
  //2.1 TEST-2 ENTERING TEST CASE
  //2.1.1 Enter the destination name
  const destinationInput = testCase.generateDestinationName();
  await driver.findElement(By.name('ss')).sendKeys(destinationInput);
  
  //2.1.2 Enter the checkin and checkout dates
  const dates = await driver.findElement(By.className("xp__dates-inner"));
  await dates.click();//Click dates box
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

  //console.log(destination, checkinDateInput, checkoutDateInput, noOfAdults, noOfChildren);

  //2.2 TEST-2 RESULT CHECKING (TEST ORACLE, maybe test more)
  try {
      await driver.wait(until.titleContains(destinationInput), 5000);//Check the title
      console.log("Test-2 Result: Passed! Successfully load hotels in "+destinationInput);
  } catch (e) {
      console.log("Test-2 Result: Failed! Failed to load hotels in "+destinationInput);
  }

    console.log(destinationInput,checkin,checkout,noOfAdults,noOfChildren);
  //************************************************************************************************************************
  //await driver.quit();

};

exampleTest();
