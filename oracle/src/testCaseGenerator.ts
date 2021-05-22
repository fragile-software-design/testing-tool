import faker from 'faker';

export class TestCase{

    generateDestinationName (){
        const destination = faker.address.cityName();//Generate city name randomly
        return destination;
    }

    changeDateFormat (date){
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        const newFormat = `${year}-${month}-${day}`;
        return newFormat;
    }

    generateDates (){
        /*CHECKIN DATE*/
        const today = new Date();
        const checkin = new Date(today);
        checkin.setDate(checkin.getDate() + 1);//set checkin date to tommorrow (feel free to change)
        const checkinDateInput = this.changeDateFormat(checkin);

        /*CHECKOUT DATE*/
        const stayDuration = Math.floor((Math.random() * 10) + 1);//stay duration from 1 day to 10 days (feel free to change)
        const checkout = new Date (checkin);
        checkout.setDate(checkout.getDate() + stayDuration);
        const checkoutDateInput = this.changeDateFormat(checkout);

        return {
            checkinDateInput,
            checkoutDateInput
        };
    }

    generateNoOfAdults (){
        return Math.floor((Math.random()*10)+1);//random number from 1-10
    }

    generateNoOfChildren (){
        return Math.floor((Math.random()*10));//random number from 0-10
    }

    getExpectedResult (){
        return 'Passed';//All the generated input parameters here should pass the test
    }
}