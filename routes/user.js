import axios from 'axios'

const clientID = '85ec7eb9dc0543fc9408c8ba05fd2bdb';
const clientSecret = 'c9192d5af4bb450da0770bf5b23f4e49';
const redirect_uri = 'http://localhost:3000/user'


export function getUserAccess(app){
    app.get('/test', (req, res) => {
        return axios.get('https://accounts.spotify.com/authorize', {
            params: {
                client_id: clientID,
                response_type: 'code',
                redirect_uri,
                // todo add state (refer to guide) here for security. Highly recommended
            }
        }).then(response => {
            console.log(response);

            app.get('/user', (req, res) =>{
                return axios({
                    method: 'POST',
                    url: 'https://accounts.spotify.com/api/token',
                    params: {
                        grant_type: "authorization_code",
                        code: req.query.code,
                        redirect_uri,
                    },
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
                    }
                }).then(response => {
                    console.log(response.data.access_token);
                    return response.data.access_token
                }).catch(err => {
                    console.log(err)
                })
            })

        }).catch(err => {
            console.log(err);
        })
    })

}






