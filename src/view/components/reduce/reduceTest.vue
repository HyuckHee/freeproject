<template>
  <section class="con">
    <div>
      <input v-model="number" id="inputN">
      <button class="btn" @click="add">추가</button>
      <button class="btn" @click="addCalculate">덧셈 계산</button>
      <button class="btn" @click="multiplication">곱셈 계산</button>
      <button class="btn" @click="multiplication">낮은수로 나열</button>
      <button class="btn" @click="save">저장</button>
      <p>arr : {{arr.length == 0 ? '' : arr}}</p>
      <p v-if="arc != null">archiveLog : {{getArc}}</p>
      <p>{{result}}</p>
    </div>
  </section>
</template>

<script>
export default {
name: "reduceTest",
  components : {
  },
  data() {
    return {
      number: 0,
      arr: [],
      result: 0,

      //*****************defineProperty*********************************************************
      // temperature : null,
      // archive : []
      arc : null,
      getArc : []
    }
  },
  mounted() {
    this.arc = new this.Archiver();
  },
  methods: {
    created() {
      this.add();
      this.addCalculate();
    },
    Archiver(){
      var temperature =null
      var archive = []

      Object.defineProperty(this,'temperature',{
        get:function (){
          console.log('get');
          console.log(temperature)
          return temperature;
        },
        set:function (value){
          temperature = value;
          console.log(temperature)
          archive.push({val : temperature})
        }
      });
      this.getArchive = ()=> {return archive;}
    },
    save(){
      if(this.arr == null){ return; }
      this.arr.forEach((e)=>{
        this.arc.temperature = e;
      })
      this.number = null;

      this.getArc = this.arc.getArchive()
      console.log(this.arc.getArchive())
    },
    add() {
      if (this.number == null) return false;
      console.log(this.number)
      this.arr.push(parseInt(this.number))
      this.number = null;
      console.log(this.arr)
      return true
    },
    addCalculate() {
      if(this.result != 0 ){
        this.result = 0
      }
      this.result = this.arr.reduce((acc, cur) => {
        return acc + cur
      },0)

      this.arr = []

      return true
    },
    multiplication(){
      if (this.arr.length == 0) return false;
      if(this.result != 0) {
        this.result = 0
      }
      this.result = this.arr.reduce((acc, cur) => {
        return acc * cur
      },)

      this.arr = []

      return true
    }
  }
}
</script>

<style scoped>

</style>
