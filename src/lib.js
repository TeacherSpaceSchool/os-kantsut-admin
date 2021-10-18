const regexpUA = /(Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|iOS|Mobile)/

export const checkMobile = (ua)=>{
    return regexpUA.exec(ua)!==null
}
export const getJWT = (cookie)=>{
    let name = 'jwt=';
    let decodedCookie = decodeURIComponent(cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}
export const checkInt = (int) => {
    if(int&&int.length>1&&int[0]==='0')
        int = int.substring(1)
    int = parseInt(int)
    return isNaN(int)?0:int
}
export const checkFloat = (float) => {
    float = parseFloat(float)
    return isNaN(float)?0:Math.round(float * 1000)/1000
}
export const inputFloat = (str) => {
    if(!str.length)
        return '0'
    let oldStr = str.substring(0, str.length-1)
    let newChr = str[str.length-1]
    if(!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ','].includes(newChr))
        return oldStr
    if(','===newChr) {
        str = oldStr+'.'
        newChr = '.'
    }
    if(newChr==='.'&&oldStr.includes('.'))
        return oldStr
    if(str.length===2&&str[0]==='0'&&newChr!=='.')
        return str[1]
    return str
}
export const pdDDMMYYYY = (date) =>
{
    date = new Date(date)
    date = `${date.getDate()<10?'0':''}${date.getDate()}.${date.getMonth()<9?'0':''}${date.getMonth()+1}.${date.getFullYear()}`
    return date
}
export const pdDDMMYY = (date) =>
{
    date = new Date(date)
    date = `${date.getDate()<10?'0':''}${date.getDate()}.${date.getMonth()<9?'0':''}${date.getMonth()+1}.${date.getYear()-100}`
    return date
}
export const pdDatePicker = (date) =>
{
    date = new Date(date)
    date = `${date.getFullYear()}-${date.getMonth()<9?'0':''}${date.getMonth()+1}-${date.getDate()<10?'0':''}${date.getDate()}`
    return date
}
export const pdDDMMYYHHMM = (date) =>
{
    date = new Date(date)
    date = `${date.getDate()<10?'0':''}${date.getDate()}.${date.getMonth()<9?'0':''}${date.getMonth()+1}.${date.getYear()-100} ${date.getHours()<10?'0':''}${date.getHours()}:${date.getMinutes()<10?'0':''}${date.getMinutes()}`
    return date
}
export const pdDDMMYYHHMMCancel = (date) =>
{
    date = new Date(date)
    date.setMinutes(date.getMinutes() + 10);
    date = `${date.getDate()<10?'0':''}${date.getDate()}.${date.getMonth()<9?'0':''}${date.getMonth()+1}.${date.getYear()-100} ${date.getHours()<10?'0':''}${date.getHours()}:${date.getMinutes()<10?'0':''}${date.getMinutes()}`
    return date
}
export const differenceDates = (date1, date2) =>
{
    return (new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24)
}
export const validMail = (mail) =>
{
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}
export const validPhone = (phone) =>
{
    return /^[+]{1}996[0-9]{9}$/.test(phone);
}
export const currencys = ['сом', 'тенге', 'рубль', 'доллар', 'евро',  'вон', 'гривна', 'дирхам', 'драм', 'иена', 'крона', 'лари', 'лев', 'манат', 'песо', 'реал', 'рупия', 'сомони', 'сум', 'форинт', 'франк', 'шекель', 'шиллинг', 'юань','фунт']
