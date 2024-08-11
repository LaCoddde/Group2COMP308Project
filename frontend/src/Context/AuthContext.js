import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [loginData, setLoginData] = useState({id:'', email: '', gender:'', age:0, name:'', roleId: 'nurse'});
   
    const setLogin = (data) => {
        const {id, email, gender, age, name, roleId} = data;
        setLoginData({ id, email, gender, age, name, roleId });
    };

    return(
        <AuthContext.Provider value={{ loginData, setLogin }}>
            {children}
        </AuthContext.Provider>
    )
}