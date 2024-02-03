const sequelize = require("../connections/database");
const ForgotPassword = require("../models/ResetPassword");
const User = require("../models/User");
const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_KEY;

exports.resetPassword = async (req, res) => {
    const t = sequelize.transaction();

    try {
        let email = req.body.email;
        let user = await User.findOne(
            {
                where: {
                    email: email
                }
            })
        if (user) {
            const id = uuid.v4();
            await user.createForgotPassword({ id, active: true });
            const apiInstance = new Sib.TransactionalEmailsApi();
            console.log("working")
            const sendEmail = await apiInstance.sendTransacEmail({
                sender: { "email": "yuktapatil1820@gmail.com" },
                to: [{ "email": req.body.email }],
                subject: "Reset Your Expense Tracker Password",
                textContent: "Expense Tracker will help to cover your day-to-day expenses.",
                htmlContent: `<a href="http://localhost:3000/resetpassword/${id}" type="button">Reset password</a>`,
            })
            console.log("Nitin working");
        }

    } catch (error) {
        console.log(error)
    }
}

exports.getResetPassword = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        let forgotpasswordrequest = ForgotPassword.findOne({ where: { id } })
        if (forgotpasswordrequest) {
            console.log(forgotpasswordrequest.active, "here is active")
            ForgotPassword.update({ active: false }, { where: { id } });
            res.status(200).send(`  <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/updatepassword/${id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required>
                                        <input name='resetpasswordid' type='hidden' value='${id}'>
                                        <button>reset password</button>
                                    </form>`
            )
            res.end();

        }

    } catch (error) {
        console.log(error);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const newpassword = req.body.newpassword;
        const resetpasswordid = req.body.resetpasswordid;
        console.log(newpassword, resetpasswordid);

        let resetpasswordrequest = await ForgotPassword.findByPk(resetpasswordid);
        let user = User.findOne({ where: { id: resetpasswordrequest.userId } })
        if (user) {
            const saltrounds = 10;
            bcrypt.genSalt(saltrounds, (err, salt) => {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        throw new Error(err)
                    }
                    User.update({ password: hash }, { where: { id: resetpasswordrequest.userId } }).then(() => {
                        //res.sendStatus(201).json({message:'Successful Update new Password'})
                    })
                })
            })
        }
        else {
            res.send(404).json({ error: "No user Exists", success: false })
        }
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error, success: false })
    }
}