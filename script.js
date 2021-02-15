function newTrasation() {
    document.querySelector('.modal-overlay').classList.add('active')
}


function cancelButton() {
    document.querySelector('.modal-overlay').classList.remove('active')
}

// Função para salvar no LocalStorage
//LocalStorage guarda como valor string
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("App.Financial")) || []
    },

    set(transaction){
        localStorage.setItem("App.Financial", JSON.stringify(transaction))
    }
}


//Criação de um array para salvar os valore dos laçamento do html

const Transaction = {

    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()

    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;
        //pegar todas as transacoes
        //para cada transacao

        Transaction.all.forEach(function(transaction){
            //se ela for maior do que zero

            if(transaction.amount > 0){
                //somar a uma variavel e retornar a variavel

                income += transaction.amount;
            }

        })

        return income
    },

    expenses(){
        let expense = 0;
        //pegar todas as transacoes
        //para cada transacao

        Transaction.all.forEach(function(transaction){
            //se ela for maior do que zero

            if(transaction.amount < 0){
                //somar a uma variavel e retornar a variavel

                expense += transaction.amount;
            }

        })

        return expense

    },

    total() {

        return Transaction.incomes() + Transaction.expenses()
        
        
    },

}


const DOM = {

    // Objeto que busca os dados automaticos na tabela.
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {

        //Troca de classe caso seja valor positivo ou negativo
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="">
        </td>`

        return html

    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction(){
        DOM.transactionContainer.innerHTML = ""
    }
}


//Funcção para converter valores e mostrar moedas
const Utils = {

    formatAmount(value) {
    //     value = Number(value) * 100
    //    return value

        value = value * 100
        return Math.round(value)


    },

    formatDate(date){
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })



        return signal + value
    },

}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){

        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
         const {description, amount , date} = Form.getValues()

         if(description.trim() === "" || amount.trim() === "" || date.trim() ===""){
         throw new Error ("Por favor, preencha todos os campos")
         }



    },

    formatValues(){
        let {description, amount , date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date

        }

    },

    // saveTransaction(){
    //     Transaction.add(transaction)
    // },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },



    submit(event){
       event.preventDefault()


        try {
             // Verificar se todas as informações foram preenchidas

         Form.validateFields()

        // formatar os dados para salvar

        const transaction = Form.formatValues()
        //Salvar

        //apagar os dados do formulário
        Transaction.add(transaction)

        Form.clearFields()

        // Fechar modal
        cancelButton()

        } catch (error) {
            alert(error.message)
        }


    }
}

const App = {

init(){
        // Faz o preenchimento da tabela - Add , limpa e atualiza
Transaction.all.forEach(function(transaction, index){
    DOM.addTransaction(transaction, index)

    Storage.set(Transaction.all)

}),

DOM.updateBalance()


},
reload(){
    DOM.clearTransaction()
    App.init()

}

}

App.init()





















