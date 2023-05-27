const isLogin = async (req,res,next)=>{
    try {
        if(req.session.adminid){
         
        }else{
           
            res.redirect("/admin");
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
 }

 const isLogout = async(req,res,next)=>{
    try {
        if(req.session.adminid){
            res.redirect('/admin/adhome');
        }
        next()
        
    } catch (error) {
        console.log(error.message);
    }
 }

 module.exports = {
isLogin,
isLogout
 }