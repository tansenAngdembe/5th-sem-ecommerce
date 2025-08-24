import {useForm} from "react-hook-form"
import { signup } from "../../../utils/user";
import singup from "../../assets/signup.svg";
import { toast } from "react-toastify";



const Signup = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState:{errors},
        reset

    } = useForm();
    const onSubmit =async (data)=>{
        const newUser = await signup(data)
        // console.log(data)
        console.log(newUser)
        if(newUser.code === 201){
            toast.success(newUser.message, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,  // Ensure it closes even if hovered
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
            
                    });
                    reset()

        }else{
            toast.success(newUser.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,  // Ensure it closes even if hovered
            draggable: true,
            progress: undefined,
            theme: "dark",

        });
        }

    }
    return (
        <div id="signup" className="w-full h-full ">
            <div className="flex flex-row  gap-[129px]">
                <div className="">
                    <img src={singup} alt="Singup-image" />
                </div>
                <div id="signup-form" className="flex flex-col justify-center">
                    <div >
                        <h1 className="text-3xl">Create an account</h1>
                        <p>Enter your details below</p>

                    </div>
                    <div>
                        <div className="flex flex-col gap-[20px] mt-[50px] w-[400px]">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] w-[400px]">
                                <input type="text" placeholder="Name" 
                                {...register("username",{
                                    required:"Name is required",
                                    minLength:3,
                                    maxLength:20,
                                    pattern : {
                                        value:/^[A-Za-z\s]{3,20}$/,
                                        message:"Minimun 3 and maximum 20 characters"
                                    }

                                })}
                                className="border-2 border-t-0 border-l-0 border-r-0 text-xl p-1" />
                                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                                
                                <input type="email" placeholder="Email" 
                                {...register("email",{
                                    required:"Email is required",
                                    pattern:{
                                        value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Email is not valid"
                                    }
                                })}
                                className="border-2 border-t-0 border-l-0 border-r-0 text-xl p-1"/>
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                                <input type="number" placeholder="Phone number."
                                {...register("phoneNumber",{
                                    required:"Phone number is required",
                                    minLength:10,
                                    
                                })}
                                 className=" border-2 border-t-0 border-l-0 border-r-0 text-xl p-1"/>
                                {errors.phoneNumber && <p className="text-red-500 ">{errors.phoneNumber.message}</p>}

                                <input type="password" placeholder="Password"
                                {...register("password",{
                                    required:"Password is required",
                                    minLength:8,
                                    pattern:{
                                        value:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
                                        message:"Password should contain at least one Uppercase,Lowercase,symbols,number and aleast 8 characters"
                                    }
                                })}
                                 className=" border-2 border-t-0 border-l-0 border-r-0 text-xl p-1"/>
                                {errors.password && <p className="text-red-500 ">{errors.password.message}</p>}
                               
                                <input type="password" placeholder="Confirm Password"
                                 {...register("confirmPassword",{
                                    required:"Confirm Password is required",
                                    validate:(value)=>(
                                        watch("password") === value || "Password do not match"
                                    )
                                 })}
                                 className="border-2 border-t-0 border-l-0 border-r-0 text-xl p-1"/>
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                                <button type="submit" className="bg-red-500 p-3 rounded-xl text-white">Create Account</button>
                            </form>
                        </div>
                        <div>
                            <p>Already have an account? <a href="/login">Login</a></p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Signup;