const mongoose = require('mongoose');
const { string } = require('zod');

// User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    groups: [{
        group_id: {
            type: String,
            required: false
        },
        group_name: {
            type: String,
            required: false
        }
    }],
    notifications: [{
       
        Read:{
            type:Boolean,
            default:false,
            required:true
        },

        notification_type:{
            type:String,
            required:true
        },

        from:{
            type:String,
            required:true
        },

        amount:{
            type:Number,
            required:true
        
        },
        note:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            required:true
        },
        group_name:{
            type:String,
            required:false,
        }
    }],

    history:[{
        group_id:{
            type:String,
            required:false
        },
        group_name:{
            type:String,
            required:false
        },
        amount:{
            type:Number,
            required:true
        },
        note:{
            type:String,
            required:false
        },
        date:{
            type:Date,
            required:true
        },
        history_type:{
            type:String,
            required:true
        },
        with:{
            type:String,
            required:true
        },
    
    }]
});

// Group schema
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        email: {
            type: String,
            required: true
        },
        member_id:{
            type:Number,
            required:true
        }
       
    }],
    member_count:{
        type:Number,
        required:true
    },
    transction_matrix:{
        type:[[Number]],
        required:true,
    }
    
});


// Export models
const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);

module.exports = { User, Group };
