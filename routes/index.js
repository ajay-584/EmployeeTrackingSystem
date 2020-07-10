require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
var adminLogin = require('../module/adminLogin');
var empdb = require('../module/adminAddEmp');
var taskdb = require('./../module/assignTask');
var desidb = require('./../module/designation');
var skilldb = require('./../module/skills');
var tasktypedb = require('./../module/taskType');
var sprintdb = require('./../module/taskSprint');
var releasedb = require('./../module/release');
var empLogin = require('./../module/empLogin');
const taskStausDb = require('./../module/taskStatus');
var dailyUpdateDb = require('../module/dailyUpdate');
const updateAssignTask = require('./../module/updateAssignTask');
var moment = require('moment');
const session = require('express-session');
const mongoose  = require('mongoose');
var uuid = require('uuid');


function lougut(req, res, next) {
  var sess = req.session;
  if (!sess.email) {
    res.redirect('/');
  }
  next();
};


/* GET home page. */
router.get('/', function (req, res, next) {
  sess = req.session;
  if (sess.email) {
    res.render('index', { title: 'Employee Traker' });
  }
  res.render('index', { title: 'Employee Traker' });
});


/* =========================================================================Admin_Section_Start======================================================================== */


// ---------------------------------------------------Admin Login start
router.get('/adminLogin', function (req, res, next) {
  // checking session
  sess = req.session;
  if (sess.email) {
    res.render('admin/adminDashboard', { title: 'Employee Traker', msg: '' });
  }
  res.render('admin/adminLogin', { title: 'Employee Traker', msg: '' });
});
//  taking email and password form amdin sir
router.post('/adminLogin', function (req, res, next) {
    // checking amdin email
    // adminLogin.create({ email:req.body.adminEmail,password:req.body.adminPass});
    console.log("admin data insetted");
    adminLogin.findOne(
      { email: req.body.adminEmail },
      function (err, result) {
        // checking errr
        if (err) {
          console.log('checking email fail...');
        }
        // checking result data
        if (result) {
          // checking password of admin
          if (result.password == req.body.adminPass) {
            // console.log('login done');
            // Taking email for creating session for logut
            sess = req.session;
            // console.log(sess);
            sess.email = req.body.adminEmail;
            // console.log(sess.email);
            res.redirect('/adminDashboard');
          } else {
            // console.log('pass not match');
            res.render('admin/adminLogin', { title: 'Employee Traker', msg: 'Wrong password' });
          }
        } else {
          // console.log('Email does not exist');
          res.render('admin/adminLogin', { title: 'Employee Traker', msg: 'Invalid Email' });
        }
      }
    ); // end of admin login db
  }); // end of post menthod
// ------------------------------------------------------------------admin login routes ends

// -----------------------------------------------------------------Admin dashboard routes start
router.get('/adminDashboard', function (req, res, next) {
  sess = req.session;
  if (sess.email) {
    res.render('admin/adminDashboard', { title: 'Employee Traker' });
  }
  else {
    res.redirect('/');
  }

}); // end of get method
// ------------------------------------------------------------------Admin dashboard routes ends here

// -----------------------------------------------------------Admin Add employess routes start here 
router.get('/adminAddEmp',lougut, async function (req, res, next) {

  var v1 =  await desidb.find({});
  var v2 =  await skilldb.find({});
      res.render('admin/adminAddEmp', { title: 'Employee Traker', msg: '',desigArray:v1,empSkillArray:v2 }); 
}); // end of get method

// taking data form admin to insert
router.post('/adminAddEmp', function (req, res, next) {
  empdb.create({
    name: req.body.emp_name,
    phoneNo: req.body.emp_phone,
    email: req.body.emp_email,
    gender: req.body.emp_gender,
    designation: req.body.emp_desi,
    primarySkill: req.body.emp_prim_skill,
    secondarySkill: req.body.emp_sec_skill,
    joinDate: req.body.emp_join_date,
    workHour: req.body.emp_work_hour
  },
    function (err, data) {
      // checking errro
      if (err) {
        console.log('emp data insert hone me error aa raha h');
      }
      // console.log("insert ho gaya bhaya");
      // console.log(data);
      // here inserting in empLoging colletin emp email and pass as '12345' for emp pass for login
      const hashPass = bcrypt.hashSync('12345',10);
      empLogin.create({
        email : req.body.emp_email,
        password : hashPass,
        name : req.body.emp_name,
        empId : data._id
      });
    }
  );
  res.render('admin/adminAddEmp', { title: 'Employee Traker', msg: 'Data is inserted',desigArray:[],empSkillArray:[] });
});
// ------------------------------------------------------admin Add employee routes is ends here 


// -----------------------------------------------------Admin view employees routes is start here
router.get('/adminViewEmp',lougut,async function (req, res, next) {
  var doc = await empdb.aggregate([
  {$lookup:{from:'designation',localField:'designation',foreignField:'_id',as:'designation'}},
  {$lookup:{from:'skills',localField:'primarySkill',foreignField:'_id',as:'primarySkill'}},
  {$lookup:{from:'skills',localField:'secondarySkill',foreignField:'_id',as:'secondarySkill'}}
  ]); // end of doc
  // console.log(doc[0]);
  res.render('admin/adminViewEmp', { title: 'Employee Traker', emparray: doc, moment: moment });
});
// ------------------------------------------------------admin view employees routes is ends here

// ------------------------------------------------------Admin assign task route start here.
router.get('/adminAssignTask',lougut,async function (req, res, next) {
  var rdata = await releasedb.find({});
  var sdata = await sprintdb.find({});
  var tdata = await tasktypedb.find({});
  var edata = await empdb.find({});
  var statusdata = await taskStausDb.find({});
  res.render('admin/adminAssignTask', { title: 'Employee Traker', msg: '',rdataArray:rdata,sdataArray:sdata,tdataArray:tdata,edataArray:edata,statusArray:statusdata });
}); // end of get method

// taking input form admin and store in collection
router.post('/adminAssignTask', function (req, res, next) {
  var fileName = '';
  if(req.files != null){
    var extention = req.files.file.mimetype.replace(/\//g, ' ').split(' ')[1];
    var fileName = uuid.v1() + '.' + extention;

    req.files.file.mv('./public/files/' + fileName, function (err, data) {
      // cheking errr
      if (err) {
        console.log('Emp file uploaded fail');
       }
        // console.log('upladed');
    }); // end of fname mv
  }

  taskdb.create({
    taskName: req.body.task_name,
    taskDesc: req.body.task_desc,
    taskRelease: req.body.task_release,
    taskSprint: req.body.task_sprint,
    taskType: req.body.task_type,
    assignBy: req.body.task_assgin_by,
    assignTo: req.body.task_assgin_to,
    startDate: req.body.start_date,
    dueDate: req.body.due_date,
    taskHourNeed: req.body.task_hour,
    taskId: req.body.associated_task_id,
    taskReviewer: req.body.task_reviewer,
    taskNotes: req.body.task_notes,
    taskFiles: fileName
  }, function (err, data) {
    if (err) {
      console.log('Admin Task insertin is failing..');
      console.log(err);
    } else {
      console.log('Admin Task has been assign');
    }
  }); // end of taskdb
  res.render('admin/adminAssignTask', { title: 'Employee Traker', msg: 'Data has been inseted!', rdataArray: [],sdataArray:[],tdataArray:[],edataArray:[],statusArray:[] });
});  // end of post mehtod
// ------------------------------------------------------------------Admin assing task route ends here


//----------------------------------------------------------------- Admin monitore route start here
router.get('/adminMonitorTask', lougut, async function (req, res, next) {
  data = await taskdb.aggregate([
    {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
    {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
    {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
    {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
    {$lookup:{from:'employees',localField:'assignTo',foreignField:'_id',as:'assignTo'}},
    {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
  ]);
  // console.log(data);
  // Printing Task data from assign task comlletion
  res.render('admin/adminMonitorTask', { title: 'Employee Traker', dataArray: data, moment:moment });
}); // end of get method
//--------------------------------------------------------------------- amdin monitore route ends here

//-----------------------------------------------------------------------admin assign task view task routes start here
router.get('/adminViewAssignTask',lougut, async function(req,res){
  var session = req.session;
  try{
  var data = await taskdb.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
      {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
      {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
      {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
      {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
  ]);
    // console.log(data);
    var statusData = await taskStausDb.find({});
    var updateData = await updateAssignTask.aggregate([{$match : {taskId: mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
  ]);
    // console.log(updateData);

  res.render('admin/adminViewAssignTask', { title: 'Employee Traker',msg : '', updateFlag:req.query.updatFlag,moment:moment, empEmail:session.email, data:data,tdata:statusData,updateData:updateData });
}catch(err){
  // cheking erro
  console.log(err)
}
}); // end of get method

//--------------------------------------------------------------------admin assign task view Task routes ends here

// ------------------------------------------------------------------admin add designation routes starts here
router.get('/adminAddDesi', lougut, function (req, res, next) {
  desidb.find(function (err, data) {
    if (err) {
      console.log('Designation name findin fail.......');
    }
    res.render('admin/adminAddDesi', { title: 'Employee Traker', msg: '', desiArray: data });
  }); // end of desidb
}); // end of get method

// Taking data form admin to insert in desiganation collection.
router.post('/adminAddDesi', function (req, res, next) {
  // inserting date
  desidb.create({
    designationName: req.body.desi_name
  }, function (err, data) {
    // checkin error
    if (err) {
      console.log('Designation insertion fail......');
    }
  }); //end of desidb
  res.redirect('/adminAddDesi');
}); // end of post method
// --------------------------------------------------------------------admin add designation routes ends here

// -----------------------------------------------------------------Admin add task status routes start here
router.get('/adminAddTaskStatus',lougut, function (req, res, next) {
  taskStausDb.find(function (err, data) {
    // checking error
    if (err) {
      // if error
      console.log('Staus name findin fail.......');
    }
    // if okey
    res.render('admin/adminAddTaskStatus', { title: 'Employee Traker',msg:'',statusArray:data });
  }); // end of skilldb
}); // end of get method

// Taking staus name form admin to insert in taskStatus collection
router.post('/adminAddTaskStatus', function (req, res, next) {
  // inserting date
  taskStausDb.create({
    StatusName:req.body.StatusName
  },function (err, data) {
    // checkin error
    if (err) {
      // if  error
      console.log('Staus insertion fail......');
    }
    // if okey
    // console.log('data inserted')
  });
  res.redirect('/adminAddTaskStatus');
});
//  ---------------------------------------------------------------------Admin add task status routes ends here

// -----------------------------------------------------------------------Admin add skills routes start here
router.get('/adminAddSkills',lougut, function (req, res, next) {
  skilldb.find(function (err, data) {
    // checking error
    if (err) {
      // if error
      console.log('Designation name findin fail.......');
    }
    // if okey
  res.render('admin/adminAddSkills', { title: 'Employee Traker',msg:'',skillArray:data });
  }); // end of skilldb
}); // end of get method


// Taking skill name form admin to insert in skills collection
router.post('/adminAddSkills', function (req, res, next) {
  // inserting date
  skilldb.create({
    skillName:req.body.skill_name
  }, function (err, data) {
    // checkin error
    if (err) {
      // if  error
      console.log('Designation insertion fail......');
    }
    // if okey
    // console.log('data inserted')
  }
  );
  res.redirect('/adminAddSkills');
});
// ------------------------------------------------------------------------Admin add skills routes ends here

// ------------------------------------------------------------------------Admin add task type routes start here
router.get('/adminAddTaskType',lougut, function (req, res, next) {
  tasktypedb.find(function(err,data){
    // checkin err
    if(err){
      // if error
      console.log('Finding task type fail...');
      console.log(err);
    }
    // if okey then print data in table
    res.render('admin/adminAddTaskType', { title: 'Employee Traker',msg:'',taskTypeArray:data });
  });
});

// Taking data form adnin to insert in task types colletion
router.post('/adminAddTaskType', function (req, res, next) {
  tasktypedb.create({
    taskName : req.body.task_type_name
  },
  function(err,data){
    // checking error
    if(err){
      // if error
      console.log('Task Name inserting failing..');
    }
  });
  // if okey
  res.redirect('/adminAddTaskType');
});
// ------------------------------------------------------------------------------admin add task type routes ends here

// -----------------------------------------------------------------------------Admin add task sprint routes start here
router.get('/adminAddSprint',lougut, function (req, res, next) {
  sprintdb.find(function(err,data){
    // checkin err
    if(err){
      // if error
      console.log('Finding task type fail...');
      console.log(err);
    }
    // if okey then print data in table
    res.render('admin/adminAddSprint', { title: 'Employee Traker',msg:'',taskSpirntArray:data });
  });
});

// Taking data form adnin to insert in task sprint colletion
router.post('/adminAddSprint', function (req, res, next) {
  sprintdb.create({
    sprintName : req.body.task_spint_name
  },
  function(err,data){
    // checking error
    if(err){
      // if error
      console.log('Task Name inserting failing..');
    }
  });
  // if ok
  res.redirect('/adminAddSprint');
});
// -------------------------------------------------------------------------admin add task sprint routes ends here

//-------------------------------------------------------------------- Admin add task release routes start here
router.get('/adminAddRelease',lougut, function (req, res, next) {
  releasedb.find(function(err,data){
    // checkin err
    if(err){
      // if error
      console.log('Finding task type fail...');
      console.log(err);
    }
    // if okey then print data in table
    res.render('admin/adminAddRelease', { title: 'Employee Traker',msg:'',releaseArray:data });
  });
});

// Taking data form adnin to insert in task release colletion
router.post('/adminAddRelease', function (req, res, next) {
  releasedb.create({
    releaseName : req.body.task_release_name
  },
  function(err,data){
    // checking error
    if(err){
      // if error
      console.log('Task Release inserting failing..');
      console.log(err);
    }
  });
  // if ok
  res.redirect('/adminAddRelease');
});
// ------------------------------------------------------------------------admin add task release routes ends here


// -------------------------------------------------------------------------Employee emp  process tracker in admin section routs start here
router.get('/adminViewDailyUpdatedTask', lougut, async function (req, res, next) {
      doc = await dailyUpdateDb.aggregate([
        {$lookup:{from:'employees',localField:'empId',foreignField:'_id',as:'empId'}},
        {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
        {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
      ]);
       // end of empUpdateTaskProcess
      //  console.log(doc)
       res.render('admin/adminViewDailyUpdatedTask', { title: 'Employee Traker',dataArray:doc, moment: moment });
}); // end of get method
// --------------------------------------------------------------------------Employees process tracker in admin section routes ends her

/*========================================================================Admin_Section_End=======================================================================*/


/*========================================================================Employee_Section_Start=======================================================================*/

// -----------------------------------------------------------employee login routes start here
router.get('/empLogin', function (req, res, next) {
  var session = req.session;
  if(session.email){
    res.redirect('/empdashboard');
  }
  res.render('employee/empLogin', { title: 'Employee Traker',msg:'' });
}); // end of get method

router.post('/empLogin', function (req, res, next) {
  empLogin.findOne(
    {email:req.body.emp_email },
    function(err,data){
      // checking error
      if(err) throw err;
      // if okey
      if(data){
        // matching password
        // console.log(sess);
        // console.log(sess.email);
        var match = bcrypt.compareSync(req.body.emp_pass,data.password);
        if(match){
          var session = req.session;
            session.name = data.name;
            session.email = req.body.emp_email;
            session.empId = data.empId;
            // console.log(data);
          res.redirect('/empDashboard');
        }else{
          // print message to employee if emaol does not match
          res.render('employee/empLogin', { title: 'Employee Traker',msg:'Worng Password' });
        }
      }else{
        // Print message if password is worng
        res.render('employee/empLogin', { title: 'Employee Traker',msg:'Invalid Email' });
      }
    });
}); // end of get method
// -----------------------------------------------------------employees login routes ends here

// ----------------------------------------------------Employess Dashboard routs start here
router.get('/empDashboard',lougut, function (req, res, next) {
  var session = req.session;
  res.render('employee/empDashboard', { title: 'Employee Traker', empName: session.name, empEmail: session.email });
}); // end of get method
// -------------------------------------------------Employees Dashboard routes ends her

// -------------------------------------------------Employess assign task routs start here
router.get('/empAssignTask',lougut, async function (req, res, next) {
  var session = req.session;    // tasking session
  var rdata = await releasedb.find({});   // finding all release data from release collection
  var sdata = await sprintdb.find({});   // finding all sprint data from sprint colletion
  var tdata = await tasktypedb.find({});  // finding all task type from task type collection
  var edata = await empdb.find({});  // finding all employees name form employees collection
  var statusdata = await taskStausDb.find({});  // finding all Status name from taskStatus collection
  res.render('employee/empAssignTask', { title: 'Employee Traker', empId: session.empId, empName: session.name, empEmail: session.email,msg:'',rdataArray:rdata,sdataArray:sdata,tdataArray:tdata,edataArray:edata,statusArray:statusdata });
}); // end of get method

router.post('/empAssignTask', function (req, res, next) {
  var session = req.session;
  var fileName = '';
  if(req.files != null){
    var extention = req.files.file.mimetype.replace(/\//g, ' ').split(' ')[1]; // Here spliting the file name and extension
    var fileName = uuid.v1() + '.' + extention; // concatenating random file name with orignal extion
    req.files.file.mv('./public/files/' + fileName, function (err, data) {
      // cheking errr
      if (err) {
        // console.log('Emp file uploaded fail');
       }
        // console.log('upladed');
    }); // end of fname mv
  }
  taskdb.create({  // inserting task in assignTask collection
    taskName: req.body.task_name,
    taskDesc: req.body.task_desc,
    taskRelease: req.body.task_release,
    taskSprint: req.body.task_sprint,
    taskType: req.body.task_type,
    assignBy: req.body.task_assgin_by,
    assignTo: req.body.task_assgin_to,
    startDate: req.body.start_date,
    dueDate: req.body.due_date,
    taskHourNeed: req.body.task_hour,
    taskStatus: req.body.task_status,
    taskId: req.body.associated_task_id,
    taskReviewer: req.body.task_reviewer,
    taskNotes: req.body.task_notes,
    taskFiles: fileName
  }, function (err, data) {
    if (err) {
      // checking error
      // console.log('Emp Task insertin is failing..');
      console.log(err);
    } else {
      // console.log('Emp Task has been assign');
    }
  }); // end of taskdb
  res.render('employee/empAssignTask', { title: 'Employee Traker', empId: session.empId, empName: session.name, empEmail: session.email, msg: 'Data has been inseted!',rdataArray:[],sdataArray:[],tdataArray:[],edataArray:[],statusArray:[] });
}); // end of post method
// ------------------------------------------------------------------------Employees assign task routes ends her

// ---------------------------------------------------------------------------Employess myAssign task routs start here
router.get('/myAssignTask',lougut, function (req, res, next) {
  var session = req.session;
  // Taking email through seesion
  empdb.findOne({email:{$eq:session.email}}, // searching seesion email to in employees collection for finding employees Id
    function(err,data){
      // checking error
      if(err) throw err;
      // console.log('data has been find')
      if(data){
        // Now take id form employee colletion through emp email
        var empId = data._id;
        //  Now findin task by using emp id in assign task collection
        taskdb.aggregate([{$match:{assignTo:empId}},
          {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
          {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
          {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
          {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
          {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
        ],
          function(err,result){
            if(err) throw err;
            // console.log(result);
            // print all task which is assign to employee
            if(result){
            // checking if any data in result then print it
            // console.log(result[0])
            res.render('employee/myAssignTask', { title: 'Employee Traker', moment:moment, empName: session.name, empEmail: session.email, dataArray:result });
            }else{
              // if no data present in result then passing null aarray
              console.log('no data in result');
              res.render('employee/myAssignTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
            }
          });
      }else{
        console.log('email dones not matched');
        res.render('employee/myAssignTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
      }
    });
}); // end of get method
// ---------------------------------------------------------Employees myAssign task routes ends her

// -----------------------------------------------------Employee myAssign task updater routes start here
router.get('/empUpdateMyAssignTask',lougut, async function(req,res){
  var session = req.session;
  var updateFlag = req.session.updateFlag;
  req.session.updateFlag = 0;
  try{
  var data = await taskdb.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
      {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
      {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
      {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
      {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
  ]);
    // console.log(data);
    var statusData = await taskStausDb.find({});
    var updateData = await updateAssignTask.aggregate([{$match : {taskId: mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
  ]);
    // console.log(updateData);

  res.render('employee/empUpdateMyAssignTask', { title: 'Employee Traker',msg : '', updateFlag, moment:moment, empName: session.name, empEmail:session.email, data:data,tdata:statusData,updateData:updateData });
}catch(err){
  // cheking erro
  console.log(err)
}
}); // end of get method
// post method started
router.post('/empUpdateMyAssignTask',function(req,res){
  var session = req.session;
  var fileName = '';
  if(req.files != null){
    var extention = req.files.file.mimetype.replace(/\//g, ' ').split(' ')[1];
    var fileName = uuid.v1() + '.' + extention;
    req.files.file.mv('./public/files/'+fileName,function(err,data){
      // checking errr
      if(err) throw err;
      // if okey
      // console.log('file uploaded');
    });
  }
  // fiding emp id to store in colletion
  empdb.findOne({email: {$eq:session.email}},
    function(err,data){
      // checking errr
      if(err) throw err;
      // if okey
      // inserting data in updateAssignTask collection
      updateAssignTask.create({
        taskStatus : req.body.task_status,
        empId : data._id,
        taskId : mongoose.Types.ObjectId(req.query.taskId),
        HourSpendOnTask : req.body.spend_hour,
        file : fileName,
        empComment : req.body.comment,
        assignerComment : 'NA',
        reviewerComment : 'NA'
      },function(err,doc){
        // checking err
        if(err) throw err;
        // if okey
        
      }); // end of updatedTask colletion
    }); // end of employee database
    // res.redirect('/empUpdateAssignTask', { title: 'Employee Traker', msg : 'Task has been updated',moment:moment, empEmail:session.email, data:[],tdata:[],updateData:[]});
    req.session.updateFlag = 1;
    res.redirect('/empUpdateMyAssignTask?taskId='+req.query.taskId);
}); // end of post method

// ---------------------------------------------------------Employee myAssign task updater routes end here

// ---------------------------------------------------------Employee update task process routs start here
router.get('/empDailyUpdate',lougut ,async function (req, res, next) {
  var session = req.session;
  taskData = await tasktypedb.find({});
  statusData = await taskStausDb.find({});
  empdata = await empdb.find({});
  res.render('employee/empDailyUpdate', { title: 'Employee Traker', empName: session.name, empEmail: session.email, msg:'',moment:moment,taskArray:taskData,statusArray:statusData,empArray:empdata });
}); // end of get method

router.post('/empDailyUpdate', function (req, res, next) {
  var session = req.session;
  // console.log(session.email);
  // finding emp_Id,empName form employees collection
  var fileName = '';
  if(req.files != null){
    var extention = req.files.file.mimetype.replace(/\//g, ' ').split(' ')[1];
    var fileName = uuid.v1() + '.' + extention;
    req.files.file.mv('./public/files/' + fileName, function (err, data) {
      // cheking errr
      if (err) {
        console.log('Emp file uploaded fail');
       }
        // console.log('upladed');
    }); // end of fname mv
  }
  empdb.findOne({email: {$eq:session.email}},
    function(err,data){
      // chicking error
      if(err) throw err;
      // if okey
      // now finding assinger_id and reviewr form assign task
      var empId = data._id;
        dailyUpdateDb.create({
          empId: empId,
          taskType : req.body.task_type,
          taskName : req.body.task_name,
          spendsHourOnTask : req.body.task_hour,
          taskStatus : req.body.task_status,
          empComments : req.body.emp_comments,
          taskFiles : fileName
        },function(err,result){
        // checking err
        if(err) throw err;
        // okey
        // console.log('update task inserted');
        // console.log(result)
        }); // end of empUpdateTaskProcess
    }); // end of empdb
    // console.log(Date().format('Do MMMM, YYYY'))
  res.render('employee/empDailyUpdate', { title: 'Employee Traker', empName: session.name, empEmail: session.email ,msg:'Data inserted..',moment:moment,taskArray:[],statusArray:[],empArray:[] });
}); // end of post method
// -------------------------------------------------------Employees update task process routes ends her

// ------------------------------------------------------Employee emp  View daily updates routs start here
router.get('/empViewDailyUpdates', lougut, function (req, res, next) {
  var session = req.session;
  session = req.session;
  empdb.findOne({email:{$eq:session.email}},
    function(err,data){
      // check err
      if(err) throw err;
      // if okey
      if(data){
      // console.log(data._id);
      dailyUpdateDb.aggregate([{$match:{empId:data._id}},
        // {$lookup:{from:'employees',localField:'assigner',foreignField:'_id',as:'assigner'}},
        {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
        {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
      ],
        function(err,doc){
          // checking err
          if(err) throw err;
          if(doc){
            // console.log(doc[0])
          res.render('employee/empViewDailyUpdates', { title: 'Employee Traker',moment: moment, empName: session.name, empEmail: session.email, dataArray:doc });
          }else{
            console.log('Doc is emputy in id did not found in empUpdateTaskProcess');
            res.render('employee/empViewDailyUpdates', { title: 'Employee Traker', empName: session.name, empEmail: session.email,dataArray:[] });
          }
        });
      }else{
      console.log('Data variable is empty means email did not found in empoloyee colletion');
      res.render('employee/empViewDailyUpdates', { title: 'Employee Traker', empName: session.name, empEmail: session.email,dataArray:[] });
      }
  });

}); // end of get method
// ---------------------------------------------------------------Employees view Daily updates routes ends her

//-----------------------------------------------------------------Employees Review Task routes starts

router.get('/empReviewTask', lougut, function(req,res){
  var session = req.session;
  // Taking email through seesion
  empdb.findOne({email:{$eq:session.email}},
    function(err,data){
      if(err) throw err;
      // console.log('data has been find')
      if(data){
        // Now take id form employee colletion through emp email
        var empId = data._id;
        //  Now findin task by using emp id in assign task collection
        taskdb.aggregate([{$match:{taskReviewer:empId}},
          {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
          {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
          {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
          {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
          {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
        ],
          function(err,result){
            if(err) throw err;
            // console.log(result);
            // print all task which is assign to employee
            if(result){
            // checking if any data in result then print it
            // console.log(result[0])
            res.render('employee/empReviewTask', { title: 'Employee Traker', moment:moment, empName: session.name, empEmail: session.email, dataArray:result });
            }else{
              // if no data present in result then passing null aarray
              console.log('no data in result');
              res.render('employee/empReviewTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
            }
          });
      }else{
        console.log('email dones not matched');
        res.render('employee/empReviewTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
      }
    });
});

//-----------------------------------------------------------------Employees Review Task routes end

// -----------------------------------------------------Employee review task updater routes start here
router.get('/empUpdateReviewTask',lougut, async function(req,res){
  var session = req.session;
  var updateFlag = req.session.updateFlag;
  req.session.updateFlag = 0;
  try{
  var data = await taskdb.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
      {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
      {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
      {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
      {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
  ]);
    // console.log(data);
    var statusData = await taskStausDb.find({});
    var updateData = await updateAssignTask.aggregate([{$match : {taskId: mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
  ]);
    // console.log(updateData[0]);

  res.render('employee/empUpdateReviewTask', { title: 'Employee Traker',msg : '', updateFlag, moment:moment, empName: session.name, empEmail:session.email, data:data,tdata:statusData,updateData:updateData });
}catch(err){
  // cheking erro
  console.log(err)
}
}); // end of get method
// post method started
router.post('/empUpdateReviewTask',function(req,res){
  // console.log(req.body);
  var session = req.session;
  // fiding emp id to store in colletion
  empdb.findOne({email: {$eq:session.email}},
    function(err,data){
      // checking errr
      if(err) throw err;
      // if okey
      // inserting data in updateAssignTask collection
      updateAssignTask.updateOne({_id:{$eq:mongoose.Types.ObjectId(req.body.updateAssingTaskId)}},{
        reviewerComment : req.body.reviewerComment,
      },function(err,doc){
        // checking err
        if(err) throw err;
        // if okey
        // console.log('updated');
      }); // end of updatedTask colletion
    }); // end of employee database
    // res.redirect('/empUpdateAssignTask', { title: 'Employee Traker', msg : 'Task has been updated',moment:moment, empEmail:session.email, data:[],tdata:[],updateData:[]});
    req.session.updateFlag = 1;
    res.redirect('/empUpdateReviewTask?taskId='+req.query.taskId);
}); // end of post method

// ---------------------------------------------------------Employee updater review task routes end here

//-----------------------------------------------------------------Employees assign by emp Task routes starts

router.get('/empAssignedTask', lougut, function(req,res){
  var session = req.session;
  // Taking email through seesion
  empdb.findOne({email:{$eq:session.email}},
    function(err,data){
      if(err) throw err;
      // console.log('data has been find')
      if(data){
        // Now take id form employee colletion through emp email
        var empId = data._id;
        //  Now findin task by using emp id in assign task collection
        taskdb.aggregate([{$match:{assignBy:empId}},
          {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
          {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
          {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
          {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
          {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
        ],
          function(err,result){
            if(err) throw err;
            // console.log(result);
            // print all task which is assign to employee
            if(result){
            // checking if any data in result then print it
            // console.log(result[0])
            res.render('employee/empAssignedTask', { title: 'Employee Traker', moment:moment, empName: session.name, empEmail: session.email, dataArray:result });
            }else{
              // if no data present in result then passing null aarray
              console.log('no data in result');
              res.render('employee/empAssignedTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
            }
          });
      }else{
        console.log('email dones not matched');
        res.render('employee/empAssignedTask', { title: 'Employee Traker', empName: session.name, empEmail: session.email, dataArray:[] });
      }
    });
});

//-----------------------------------------------------------------Employees Assinged by emp Task routes end

// -----------------------------------------------------Employee update assigned by task routes start here
router.get('/empUpdateAssignedTask',lougut, async function(req,res){
  var session = req.session;
  var updateFlag = req.session.updateFlag;
  req.session.updateFlag = 0;
  try{
  var data = await taskdb.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'release',localField:'taskRelease',foreignField:'_id',as:'taskRelease'}},
      {$lookup:{from:'tasksprint',localField:'taskSprint',foreignField:'_id',as:'taskSprint'}},
      {$lookup:{from:'taskType',localField:'taskType',foreignField:'_id',as:'taskType'}},
      {$lookup:{from:'employees',localField:'assignBy',foreignField:'_id',as:'assignBy'}},
      {$lookup:{from:'employees',localField:'taskReviewer',foreignField:'_id',as:'taskReviewer'}}
  ]);
    // console.log(data);
    var statusData = await taskStausDb.find({});
    var updateData = await updateAssignTask.aggregate([{$match : {taskId: mongoose.Types.ObjectId(req.query.taskId)}},
      {$lookup:{from:'taskStatus',localField:'taskStatus',foreignField:'_id',as:'taskStatus'}}
  ]);
    // console.log(updateData[0]);

  res.render('employee/empUpdateAssignedTask', { title: 'Employee Traker',msg : '', updateFlag, moment:moment, empName: session.name, empEmail:session.email, data:data,tdata:statusData,updateData:updateData });
}catch(err){
  // cheking erro
  console.log(err)
}
}); // end of get method
// post method started
router.post('/empUpdateAssignedTask',function(req,res){
  // console.log(req.body);
  var session = req.session;
  // fiding emp id to store in colletion
  empdb.findOne({email: {$eq:session.email}},
    function(err,data){
      // checking errr
      if(err) throw err;
      // if okey
      // inserting data in updateAssignTask collection
      updateAssignTask.updateOne({_id:{$eq:mongoose.Types.ObjectId(req.body.updateAssingTaskId)}},{
        assignerComment : req.body.assingerComment,
      },function(err,doc){
        // checking err
        if(err) throw err;
        // if okey
        // console.log('updated');
      }); // end of updatedTask colletion
    }); // end of employee database
    // res.redirect('/empUpdateAssignTask', { title: 'Employee Traker', msg : 'Task has been updated',moment:moment, empEmail:session.email, data:[],tdata:[],updateData:[]});
    req.session.updateFlag = 1;
    res.redirect('/empUpdateAssignedTask?taskId='+req.query.taskId);
}); // end of post method

// ---------------------------------------------------------Employee update assinged by task routes end here

// ------------------------------------------------------------Employees Change passwrod routes starts here
router.get('/empChangePass', lougut, function(req,res){
  var session = req.session;
  res.render('employee/empChangePass',{ title: 'Employee Tracker', empName: session.name, empEmail: session.email, msg:'' });
}); // end of get method

router.post('/empChangePass', function(req,res){
  var session = req.session
  empLogin.findOne({email:{$eq:session.email}},function(err,data){
    //checking err
    if(err) throw err;
    // okey
    const match = bcrypt.compareSync(req.body.curr_pass,data.password);
    if(match){
      // console.log('passwrod is correct');
      // checking new pass and confirm pass is same or not
      if(req.body.new_pass == req.body.con_pass){
        // console.log('password matched')
        var new_pass = bcrypt.hashSync(req.body.new_pass,10);
        empLogin.updateOne({email:session.email},{password:new_pass},function(err,data){
          //checking err
          if(err) throw err;
          // if okey
          // console.log(data);
          res.render('employee/empChangePass',{ title: 'Employee Tracker', empName: session.name, empEmail: session.email, msg:'Password has been changed!' });
        }); // end of emplogin update
      }else{
        res.render('employee/empChangePass',{ title: 'Employee Tracker', empName: session.name, empEmail: session.email, msg:'New password and confirm password does not matched' });
      }
    } // end of match condition
    else{
      // if current password is not matched
      res.render('employee/empChangePass',{ title: 'Employee Tracker', empName: session.name, empEmail: session.email, msg:'Current password does not matched' });
    } // end of else condition
  }); // end of empLogin
});
// ---------------------------------------------------------------------------Employees change password routes ends here


// 
/*========================================================================Employee_Section_End=======================================================================*/

// Creating route for admin logout page and destroy seesion
router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err, doc) {
    if (err) {
      console.log("logout page me error h");
    }
    console.log("logout ho gaya");
  });
  res.redirect('/');
});


module.exports = router;
