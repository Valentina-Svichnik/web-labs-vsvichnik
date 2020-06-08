const plan = []

new Vue({
  el: "#app",

  data: {
    windowVisibility: false,
    person: false, 
    boolevo: [false, false, false],
    userName: '',
    search: '',
    description: '',
    status: '',
    name: '',
    start: '',
    end: '',
    editable: false,
    num: 0,
    darkTheme: false,
    darkText: true,
    selected_id: 0,
    check_box: 0,
    schedule: [0, 0, 0],
    plan: plan
  },

  methods: {
    counter: function(){
      let plans = 0
      let works = 0
      let done = 0
      for(let i = 0; i < this.plan.length; i++){
        if(this.plan[i]['tag'] == "plan"){
          plans++
        }
        else if(this.plan[i]['tag'] == "in-work"){
          works++
        }
        else if(this.plan[i]['tag'] == "ended"){
          done++
        }
      }
      this.schedule[0] = plans
      this.schedule[1] = works
      this.schedule[2] = done
      console.log(this.schedule)
    },

    checkName: function(name){
      if(name != "" || name != " "){
        this.num++
        this.plan.push(objects('Задание ' + this.num, this.search, "", "", this.userName, "plan"))
        this.status = ''
        this.name = ''
        this.start = ''
        this.end = ''
        this.counter()
        this.person = !this.person
      }
    },
    checkTextInInput: function(search){
      if(search != '' || search != " "){
        this.search = search
        this.person = !this.person
      }
    },
    reset_input: function(){
      this.search =  '',
      this.description = '',
      this.status = '',
      this.name = '',
      this.start = '',
      this.end = ''
    },
    add_data_to_array: function(desc, status, name, start, end){
      if((status == 'plan' || status == 'in-work' || status == 'ended') && this.editable == false){
          this.uuid++
          this.plan.push(objects('Задание ' + this.num, desc, start, end, this.userName, status, ""))
          this.reset_input()
          this.windowVisibility = !this.windowVisibility
          this.counter()
      }
      else if((status == 'plan' || status == 'in-work' || status == 'ended') && this.editable == true){
                for(let i = 0; i < this.plan.length; i++){
                  if(this.plan[i]["title"].includes(this.selected_id)){
                    this.plan[i]["description"] = this.search
                    this.plan[i]["time"] = this.start
                    this.plan[i]["time_of_work"] = this.end
                    this.plan[i]["name"] = this.name
                    this.plan[i]["tag"] = this.status
                  }
                }
                this.windowVisibility = !this.windowVisibility
                this.reset_input()
                this.selected_id = 0
                this.editable = false
                this.counter()
      }
    },
    edit_app_block: function(index){
      for(let i = 0; i < this.plan.length; i++){
        if(this.plan[i]["title"].includes(index + 1)){
          if(this.plan[i]["tag"] == "plan"){
            this.boolevo[0] = true
            this.boolevo[1] = true
            this.boolevo[2] = false
          }
          else if(this.plan[i]["tag"] == "in-work"){
            this.boolevo[0] = false
            this.boolevo[1] = true
            this.boolevo[2] = false
          }
          else if(this.plan[i]["tag"] == "ended"){
            this.boolevo[0] = false
            this.boolevo[1] = false
            this.boolevo[2] = true
          }
          this.search =  this.plan[i]["description"],
          this.status = this.plan[i]["tag"],
          this.name = this.plan[i]["name"],
          this.start = this.plan[i]["time"],
          this.end = this.plan[i]["time_of_work"]
          this.editable = true
          this.windowVisibility = !this.windowVisibility
          this.selected_id = index + 1
        }
      }
    },
    ready_button: function(index){
      for(let i = 0; i < this.plan.length; i++){
        if(this.plan[i]["title"].includes(index + 1)){
          if(this.plan[i]["tag"] == "plan"){
            this.plan[i]["tag"] = 'in-work'
            if(this.plan[i]["time"] == ""){
              this.plan[i]["time"] = new Date().toLocaleString();
              this.plan[i]["data"] = new Date();
            }
          }
          else if(this.plan[i]["tag"] == 'in-work'){
            this.plan[i]["tag"] = 'ended'
            if(this.plan[i]["time_of_work"] == ""){
              var diff = this.dateDiff(this.plan[i]["data"], new Date())
              this.plan[i]["time_of_work"] = diff.years+' лет, '+
              diff.months+' месяцев, '+
              diff.days+' дней, '+
              diff.hours+' часов, '+
              diff.minutes+' минут, '+
              diff.seconds+' секунд'
            }
          }
          this.counter()
        }
      }
    },
    dateDiff: function(date1, date2) {
      var years, months, days, hours, minutes, seconds;
      var y1, m1, d1, d2, dd;
      years = date2.getFullYear()-(y1 = date1.getFullYear())
      months = date2.getMonth()-(m1 = date1.getMonth())
      days = (d2 = date2.getDate())-(d1 = date1.getDate())
      hours = date2.getHours()-date1.getHours()
      minutes = date2.getMinutes()-date1.getMinutes()
      seconds = date2.getSeconds()-date1.getSeconds()
      dd = 0
      if (seconds < 0) {
          seconds += 60;
          minutes--;
      }
      if (minutes < 0) {
          minutes += 60
          hours--
      }
      if (hours < 0) {
          hours += 24
          days--
          dd = 1
      }
      if (days < 0) {
          days = monthDays(y1, m1)-d1+d2-dd
          months--
      }
      if (months < 0) {
          months += 12
          years--
      }
      return {years: years, months: months, days: days,
              hours: hours, minutes: minutes, seconds: seconds};
    },
    delete: function(index){
      for(let i = 0; i < this.plan.length; i++){
        if(this.plan[i]["title"].includes(index + 1)){
          for(let j = i + 1; j < this.plan.length; j++){
            this.plan[j]["title"] = 'Задание ' + (this.plan[j]["title"].split(" ")[1] - 1)
          }
          this.plan.splice(i, 1)
          this.num--
          this.counter()
          console.log(this.plan.toString())
        }
      }
    },
    change_theme: function(){
      this.check_box = !this.check_box
      if(this.check_box == 1){
        this.darkTheme = true
      }
      else{
        this.darkTheme = false
      }
    },
    
    startDrag: function(evt, item) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', item.title)
      this.counter()
    },
    onDrop: function (evt, list) {
      const itemID = evt.dataTransfer.getData('itemID')
      const item = this.plan.find(item => item.title == itemID)
      item.tag = list
      if(item.tag == "in-work" && item.time == ""){
        item.time = new Date().toLocaleString()
        item.data = new Date()
      }
      else if(item.tag == "ended" && item.time_of_work == ""){
        var diff = this.dateDiff(item.data, new Date())
        item.time_of_work = diff.years+' лет, '+
        diff.months+' месяцев, '+
        diff.days+' дней, '+
        diff.hours+' часов, '+
        diff.minutes+' минут, '+
        diff.seconds+' секунд'
      }
      this.counter()
    }
  }
})

function objects(title, description, time, time_of_work, name, tag, data){
  return{
    title, description, time, time_of_work, name, tag, data
  }
}