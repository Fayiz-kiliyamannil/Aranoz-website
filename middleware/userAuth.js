const islogin = async (req,res,next)=>{
    try {
        if(req.session.userid){

        }else{
          res.redirect('/login')
            }
        next();
    } catch (error) {
        console.log("error in migddleware islogin "+error.message);
    }
}

const islogout = async (req,res,next)=>{
    try {
        if(req.session.userid){
            res.redirect('/')
        }else{
           res.redirect("/")
        }
    } catch (error) {
        console.log("error in middleware islogout"+error.message);
    }
}

const userSession = async (req,res,next)=>{

    try {
        if(req.session.userid)
            next();
        else{
          res.redirect("/")
        }
        
    } catch (error) {
        console.log("error userSession "+error.message);
    }
}
module.exports  = {
    islogin,
    
}