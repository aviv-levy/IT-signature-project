import { errorAlertMessage } from "./swalAlert.js";

export class Validation {
    constructor(object) {
        this.id = object.id;
        this.name = object.workername;
        this.date = object.date;
        this.department = object.department;
        this.itworker = object.itworker;
        this.email = object.email;
        this.items = object.items;
        this.signature = object.signature;
        this.computer = object.computer;
        this.phone = object.phone;
        this.other = object.other;
        this.arrItems = [];
    }

    getArrItems(){
        return this.arrItems;   
    }

    validateNewItems(){
        let validations = [this.signatureValidate(),this.itemsValidate(),this.itWorkerValidate(),this.dateValidate()];
        for (let i = 0; i < validations.length; i++) {
            if (!validations[i])
                return false;
        }
        return true
    }

    validateNewSecuritySign(){
        let validations = [this.signatureValidate(),this.dateValidate(),this.emailValidate(),this.departmentValidate(),this.idValidate(),this.nameValidate()];
        for (let i = 0; i < validations.length; i++) {
            if (!validations[i])
                return false;
        }
        return true
    }

    validateNewWorkerItems() {
        let validations = [this.signatureValidate(),this.itemsValidate(),this.emailValidate(),this.itWorkerValidate(),this.departmentValidate(),this.dateValidate(),this.idValidate(),this.nameValidate()];
        for (let i = 0; i < validations.length; i++) {
            if (!validations[i])
                return false;
        }
        return true
    }

    validateHRSecret(){
        let validations = [this.signatureValidate(),this.dateValidate(),this.hrIDValidate(),this.nameValidate()];
        for (let i = 0; i < validations.length; i++) {
            if (!validations[i])
                return false;
        }
        return true
    }

    idValidate() {
        if (this.id.length < 3 || this.id.length > 4 || (!/^\d+$/.test(this.id))) {
            errorAlertMessage('Oops...', 'מספר עובד חייב להיות 3 או 4 ספרות');
            return false;
        }
        return true;
    }
    hrIDValidate() {
        if (this.id.length !== 9 || (!/^\d+$/.test(this.id))) {
            errorAlertMessage('Oops...', 'מספר ת.ז לא תקין');
            return false;
        }
        return true;
    }

    nameValidate() {
        if (this.name.length < 2 || (!/^[א-ת\s]*$/.test(this.name))) {
            errorAlertMessage('Oops...', 'שם עובד לא תקין');
            return false;
        }
        return true;
    }

    dateValidate() {
        if (this.date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(this.date))) {
            errorAlertMessage('Oops...', 'נא להזין תאריך חתימה');
            return false;
        }
        return true;
    }

    departmentValidate() {
        if (this.department === 'בחר מחלקה') {
            errorAlertMessage('Oops...', 'מחלקה לא תקינה');
            return false;
        }
        return true;
    }

    itWorkerValidate() {
        if (this.itworker.length < 2 || (!/^[א-ת\s]*$/.test(this.itworker))) {
            errorAlertMessage('Oops...', 'מחתים לא תקין');
            return false;
        }
        return true;
    }

    emailValidate() {
        if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
            errorAlertMessage('Oops...', 'מייל לא תקין');
            return false;
        }
        return true;
    }

    itemsValidate() {
        if (this.items[0] === undefined) {
            errorAlertMessage('Oops...', 'בחר את הציוד להחתמה');
            return false;
        }

        let itemFlag = true;

        this.items.forEach((item) => {
            this.arrItems.push(item.value);
            switch (item.value) {
                case '3':
                    if (this.computer.length < 2) {
                        errorAlertMessage('Oops...', 'אזור מחשב לא תקין');
                        itemFlag = false;
                    }
                    break;
                case '4':
                    if (this.phone.length < 2) {
                        errorAlertMessage('Oops...', 'אזור פלאפון לא תקין');
                        itemFlag = false;
                    }
                    break;
                case '9':
                    if (this.other.length < 2) {
                        errorAlertMessage('Oops...', 'אחר לא תקין');
                        itemFlag = false;
                    }
                    break;
            }
        })
        if (!itemFlag)
            return false;

        return true;
    }

    signatureValidate() {
        if (this.signature.isEmpty()) {
            errorAlertMessage('Oops...', 'נא לחתום על מהסמך');
            return false;
        }
        return true;
    }

}