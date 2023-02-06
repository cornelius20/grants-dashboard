export const Login = async(params) => {
    try{
        const res = await fetch('https://stacks-grant-backend.herokuapp.com/api/v1/user', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify(params),
            });
        const data = await res.json();
        return data;
    }catch(err){
        return false;
    }
}