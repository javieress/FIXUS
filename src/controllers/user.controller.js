const config = require('../config/dbconfig')
const sql = require('mssql')
const user = require('../models/User')
const UserPositionList=require('../controllers/userPosition.controller')
const bodyParser = require('body-parser')

const Fn = {
	// Valida el rut con su cadena completa "XXXXXXXX-X"
	validaRut : function (rutCompleto) {
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		let tmp 	= rutCompleto.split('-');
		let digv	= tmp[1]; 
		let rut 	= tmp[0];
		if ( digv == 'K' ) digv = 'k' ;
		return (Fn.dv(rut) == digv );
	},
	dv : function(T){
		let M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
}






module.exports={
    index:async function(req,res){
        res.render('./register/user-register.ejs',{title: ' | Usuarios',message: '',User_Position_List: await UserPositionList.list()})
    },
    list: async function(){
        return await user.list()
    },
    post:async function (req,res) {
        let message = "El usuario '"
        

        if(Fn.validaRut(req.body['new-user-rut']) && (req.body['new-user-rut'].length==10 || req.body['new-user-rut'].length==9)){

            const user_esta = await user.findOneRut(req,res);
            const username_esta=await user.findOneUserName(req,res);
            if(user_esta!=null){
                message+=req.body['new-user-rut']+ "'ya existe.";
            }
            else{
                if(username_esta!=null){
                    message+=req.body['new-user-username']+ "'ya existe.";

                }
                else{
                user.post(req,res)//llamo a funcion post para que cree usuario
                message+= req.body['new-user-username'] + "' se guardó con éxito."
            
                }
            }
        }else{
            message+=req.body['new-user-username']+ "'no es valido";
            
        }
    



        res.render('./register/user-register.ejs',{title: 'FIXUM',message: message})
    },
    get: function(username){
        user.get(username)
    }
}