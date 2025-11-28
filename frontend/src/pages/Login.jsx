import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { LOGIN } from "../queries/queries"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useMutation } from "@apollo/client/react"

const Login = ({ setConfirmTitle }) => {
    const { register, handleSubmit, reset } = useForm()
    const [signIn] = useMutation(LOGIN)
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const onSubmit = async (formData) => {
        try {
            const response = await signIn({
                variables: {
                    email: formData.email,
                    password: formData.password,
                },
            })

            const token = response.data?.login?.value

            if (token) {
                login(token)
                setConfirmTitle('Olet nyt kirjautunut sisään.')
                reset()
            } else {
                setConfirmTitle('Virheelliset tunnukset')
            }
        } catch (error) {
            setConfirmTitle('Virhe kirjautumisessa')
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center p-5 text-center applications-container" style={{width: '100vw'}}>
            <div className="flex-column p-5 form-area" style={{width: '50vw', border: '1px solid black', borderRadius: '20px'}}>
                <div>
                    <h4 className="mb-5">Kirjautuminen hallintapaneeliin</h4>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                        <div className="mb-3">
                            <input
                                id="email"
                                placeholder="Sähköposti"
                                {...register("email")}
                                className="form-control rounded"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                            id="password"
                            placeholder="Salasana"
                            type="password"
                            {...register("password")}
                            className="form-control rounded"
                            required
                            />
                        </div>

                        <div className="row">
                            <div className="col d-flex gap-3 text-center mt-4">
                                <button
                                    type="button"
                                    className='btn btn-secondary mt-2'
                                    style={{width: '10vw'}}
                                    onClick={() => navigate('/')}
                                >
                                    Etusivulle
                                </button>

                                <button
                                    type="submit"
                                    className='btn btn-primary mt-2'
                                    style={{width: '10vw'}}
                                >
                                    Kirjaudu
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login