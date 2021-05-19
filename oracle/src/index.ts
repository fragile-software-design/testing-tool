import faker from 'faker';
import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';

function generateDestinationName (){
    let destination = faker.address.cityName();//Generate city name randomly
    return destination;
}

function changeDateFormat (date){
    var year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    var month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    var day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    var newFormat = `${year}-${month}-${day}`;
    return newFormat;
}

function generateDates (){
    /*CHECKIN DATE*/
    const today = new Date();
    var checkinDate = new Date(today);
    checkinDate.setDate(checkinDate.getDate() + 1);//set checkin date to tommorrow (feel free to change)
    var checkinDateInput = changeDateFormat(checkinDate);

    /*CHECKOUT DATE*/
    var stayDuration = Math.floor((Math.random() * 10) + 1);//stay duration from 1 day to 10 days (feel free to change)
    var checkoutDate = new Date (checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + stayDuration);
    var checkoutDateInput = changeDateFormat(checkoutDate);

    return {
        checkinDateInput,
        checkoutDateInput
    };
}

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
  const destinationInput = await driver.findElement(By.name('ss'));
  await destinationInput.sendKeys(generateDestinationName());
  
  //2.1.2 Enter the checkin and checkout dates
  const dates = await driver.findElement(By.className("xp__dates-inner"));
  await dates.click();//Click dates box
  await driver.findElement(By.css("td.bui-calendar__date[data-date='"+generateDates().checkinDateInput+"']")).click();//checkin
  await driver.findElement(By.css("td.bui-calendar__date[data-date='"+generateDates().checkoutDateInput+"']")).click();//checkout
  
  //2.1.3 Enter the guest details (automated case?)
  const guestDetails = await driver.findElement(By.className("xp__input"));
  await guestDetails.click();//Click the guest details box

  //2.1.3.1 No of Adults
  var noOfAdults = Math.floor((Math.random()*10)+1);//random number from 1-10
  var defaultAdults = 2;

  if (noOfAdults < defaultAdults) {
      await driver.findElement(By.css("button[aria-label='Decrease number of Adults']")).click();
  } else if (noOfAdults > defaultAdults) {
      var i;
      for (i = 0; i < noOfAdults-2; i++) {
          await driver.findElement(By.css("button[aria-label='Increase number of Adults']")).click();
      }
  }

  //2.1.3.2 No of Children
  var noOfChildren = Math.floor((Math.random()*10));//random number from 0-10
  var defaultChildren = 0;

  if(noOfChildren > defaultChildren){
      var i;
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
      await driver.wait(until.titleContains(generateDestinationName()), 5000);//Check the title
      console.log("Test-2 Result: Passed! Successfully load hotels in "+generateDestinationName());
  } catch (e) {
      console.log("Test-2 Result: Failed! Failed to load hotels in "+generateDestinationName());
  }

  //************************************************************************************************************************
  //await driver.quit();

};

exampleTest();
