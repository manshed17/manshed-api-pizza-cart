document.addEventListener('alpine:init', () => {
    //alert("Alpine loaded...")
  
    Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
        init() {
          //alert('Pizza cart loading...')
  
          axios.get('https://pizza-cart-api.herokuapp.com/api/pizzas')
            .then((result) => {
              //console.log(result.data);
              this.pizzas = result.data.pizzas
            })
  
            .then(() => {
              return this.createCart();
            })
            .then((result) => {
              this.cartId = result.data.cart_code;
            });
  
        },
  
        featuredPizzas(){
          //Get a list of featured pizzas
          return axios
              .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
        },
        postfeaturedPizzas(){
          //Get a list of featured pizzas
          return axios
              .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
        },
  
        createCart() {
          // /api/pizza-cart/create
          return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
  
        },
  
        showCart() {
          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
          axios
            .get(url)
            .then((result) => {
              this.cart = result.data;
            });
        },
  
        pay(pizza){
          const params = {
            cart_code : this.cartId,
          }
  
          axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
            .then(()=>{
                if(!this.paymentAmount){
                    this.paymentMessage = 'No amount entered!'
                }
                else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                    this.paymentMessage = 'Successfully paid!'
                    //this.message= this.username  +" "
                    setTimeout(() => {
                        this.cart.total=0;
                        this.paymentMessage = '';
                        this.paymentAmount = 0;
                        this.message = '';
                        window.location.reload()
                    }, 10000);
                  }
  
                else if(this.paymentAmount > this.cart.total.toFixed(2)) {
                  this.paymentMessage = 'Returns change'
                  setTimeout(() => {
                    this.cart.total=0
                  },10000);
                
    
                }else{
                    this.paymentMessage = 'Insufficient funds!'
                    setTimeout(() => {
                        this.cart.total=0
                    }, 10000);
                }
            
            })
            .catch(err=>alert(err));
  
          },
      
  
        //pizzaImage(pizza) {
         // return `./img/${pizza.size}.png.jpg`;
        //},
  
        pizzaImage(pizza) {
          return `./img/${pizza.size}.png`;
          
        },
  
        message: '',
        username: 'Samke',
        pizzas: [],
        featuredpizzas: [],
        cartId: '',
        cart: { total: 0 },
        paymentMessage: '',
        payNow: false,
        paymentAmount: 0,
        pizza2: '',
        add(pizza) {
  
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }
  
          axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
            .then(() => {
              this.message = ""
              this.showCart();
            })
            .catch(err => alert(err));
          //alert(JSON.stringify(pizza))
  
          }
        
  
      }
    });
  })
  