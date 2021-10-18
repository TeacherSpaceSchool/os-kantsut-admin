export let urlGQL
export let urlGQLSSR
export let urlGQLws
export let urlMain
export let urlSubscribe
export let applicationKey
if(process.env.URL==='os-kantsut.xyz') {
    urlGQLSSR = `http://${process.env.URL}:4000/graphql`
    urlGQL = `https://${process.env.URL}:3000/graphql`
    urlGQLws = `wss://${process.env.URL}:3000/graphql`
    urlSubscribe = `https://${process.env.URL}:3000/subscribe`
    urlMain = `https://${process.env.URL}`
    applicationKey = 'BIn_17NHL6WefqmBx2otvm_Kxc7ia56y05fQqiIq8lty6Q4ft-t-nGEng-s-JfdqVuIK0pTo0oy39i8--4sa_SY'
}
else {
    urlGQLSSR = `http://${process.env.URL}:3000/graphql`
    urlGQL = `http://${process.env.URL}:3000/graphql`
    urlGQLws = `ws://${process.env.URL}:3000/graphql`
    urlMain = `http://${process.env.URL}`
    urlSubscribe = `http://${process.env.URL}:3000/subscribe`
    applicationKey = 'BDDy7cXF_z4q6mkh92gEM075LQcCRRr99e81Ux3_doLhhv66SXSvK1IswHdQBQwhypkpyeABYbn_oBldlCddzkU'
}

export const validMail = (mail) =>
{
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}
export const validPhone = (phone) =>
{
    return /^[+]{1}996[0-9]{9}$/.test(phone);
}
export const checkInt = (int) => {
    return isNaN(parseInt(int))?0:parseInt(int)
}
