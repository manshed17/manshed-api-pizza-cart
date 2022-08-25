document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        init(){
            axios
            .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
            .then((result)=>{
                this.pizzas=result.data.pizzas
                 this.smallpizzas = this.pizzas['10'];
                 this.mediumFeatured = this.pizzas[7];
                 this.largeFeatured = this.pizzas[25];
                // this.smallpizzas.flavour = 'featured pizza 1'
            })
            .then(()=>{
              return this.createCart();
                })
                .then((result)=>{
                    this.cartID = result.data.cart_code;
                })
           
        },
        buys:true,
        payCart(amount){
          const body = {
            cart_code: this.cartID
           
          }
          amount = this.payment
          axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', body)
          .then((result)=>{
            // this.payment=result.data.payment
            // this.cartID = result.data.cart_code
            this.message = 'paym'
            this.showCart()
           
          })
        },
        
        createCart(){
            return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=shadrack')
            },
        
        showCart(){
          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartID}/get`;

          axios
                .get(url)
                .then((result) => {
                  this.cart = result.data
                })
        },

        pizzaImage(pizza){
          return `/${pizza.size}.png`
        },

        checkb:true,
        payNow:false,
        returnFeedback:'',
        makePayment(){
          const params = {cart_code: this.cartID,
            amount:this.paymentAmount
          }
          // amount = this.paymentAmount;
          axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(()=>{
          if(!this.paymentAmount){
            this.returnFeedback = 'please enter amount'
        }
        else if ((this.cart.total) > this.paymentAmount){
            this.returnFeedback = 'Sorry - that is not enough money!'
        }
        else{
            this.returnFeedback = 'Payment successful, Enjoy your pizzas!!'
            this.editCart=false
            
        
        setTimeout(()=>{
          if((this.cart.total) <= this.paymentAmount){
            this.appreciation = "Thank you, refresh page to create a new order"
            }
            
            this.payNow=false;
            this.clearCart()
            this.pizzas=true
            this.appreciation
            this.cartID=''
            this.clearAtPay=false
            this.titleHide=false
        }, 5000)
        

    }}
          )},
 
  
    clearCart(){
      this.cart=0.0

    },
        cart : {total: 0},
        allPizzas:true,
        clearAtPay:true,
        message : '',
        appreciation:'',
        pizzas :[],
        username:'shadrack',
        paymentAmount:0,
        cartID:'',
        editCart: false,
        feature: true,
        titleHide:true,
        smallpizzas:[],
        mediumFeatured:[],
        largeFeatured:[],
        subPizzas(pizza){
          const less = {
            cart_code: this.cartID,
            pizza_id: pizza.id
        } 
        axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', less)
        .then(()=>{
        this.message = "pizza removed from cart"
        this.showCart()
        
      })

        },
        
        add(pizza) {
            const params = {
                cart_code: this.cartID,
                pizza_id: pizza.id
              } 
   
        axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
        .then(()=>{
        this.message = "pizza added to cart"
        this.showCart()
        
      })
      },
      featured(pizzas) {
        const params = {
            cart_code: this.cartID,
            pizza_id: this.smallpizzas.id
          } 

    axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
    .then(()=>{
    this.message = "pizza added to cart"
    this.showCart()
    
  })
  }

    }
    })
})