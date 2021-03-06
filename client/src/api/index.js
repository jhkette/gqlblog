import axios from 'axios'


axios.defaults.baseURL = '/graphql';
axios.defaults.method = 'POST';
axios.defaults.headers.post['Content-Type'] = 'application/json';


export const signUpUser = async(userData)=>{
    try{
        const { data } = await axios({data:{
            query:`mutation{
                signUp(
                    fields:{
                        email:"${userData.email}"
                        password:"${userData.password}"
                    }
                ){
                    _id
                    email
                    token
                }
            }`
        }});
        console.log(data)
        // return {
        //     // auth: data.data ? data.data.signUp : null,
        //     // errors: data.errors
            
        // }
    } catch(error){
        console.log(error);
    }

}