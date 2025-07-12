export const API_KEY = 'AIzaSyDZ2peuRjB6nZeQO0_YnT0bpyclyqy04x4';


export const value_converter = (value) => {
        if (value >= 1000000) {
            return Math.floor(value/1000000)+"M";
        }
        else if(value >= 1000){
            return Math.floor(value/1000)+"K";
        }
        else{
            value;
        }
}