const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db');

function buscaTarefasPorId(req){
    return new Promise((resolve, reject)=>{

        db.get('SELECT * FROM TAREFAS WHERE id=?', [req.params.id], (err, rows)=>{
            if(err){
                reject(`Erro na requisição : ${err}`)
            }else{
                resolve(rows)
            }
            
        })  

    })
}

function buscaTarefas(){
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM TAREFAS', (err, rows)=>{
            if(err) {
                reject(`Erro na requisição: ${err}`)
        }else{
            resolve(rows)
        }
        })  
    })
}

function insereTarefa(req){
    return new Promise((resolve, reject)=>{
        
        db.run("INSERT INTO TAREFAS(TITULO,DESCRICAO, STATUS) VALUES (?, ?, ?)",
        [req.body.titulo, req.body.descricao, req.body.status], (err)=>{
            if(err) {
                reject(`Não foi possível inserir: ${err}`)
            }else{
                resolve(console.log("Inserido com sucesso!"))
            }
        });
    })
}

function editaTarefa(req){
    return new Promise((resolve, reject)=>{
        db.run('UPDATE TAREFAS SET titulo=?, descricao=?, status=? WHERE id=?', [req.body.titulo, req.body.descricao, req.body.status, req.params.id], (err)=>{
            if(err){
                reject(`Erro ao editar tarefa: ${err}`)
            }else{
                resolve(console.log('Atualizado com sucesso!'))
            }
        })
    })
}

function deletaTarefa(req){
    return new Promise((resolve, reject)=>{
        db.run('DELETE FROM TAREFAS WHERE id=?', [req.params.id], (err)=>{
            if(err){
                reject(err)
            }else{
                resolve('Deletado com sucesso!')
            }
        })
    })
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (resp)=>{
    resp.send("Hello World")
})

//Busca todas as tarefas
app.get('/tarefas', (resp)=>{
    buscaTarefas()
    .then(data=>resp.status(200).send(data))
    .catch(err=>err)
})
// Busca tarefa por id
app.get('/tarefas/:id', (req, resp)=>{
    buscaTarefasPorId(req, resp)    
    .then(data=>resp.status(200).send(data))
    .catch(err=>err)
})

// Insere tarefa no banco
app.post('/tarefas', (req, resp)=>{
    insereTarefa(req)
    .then(data=>resp.status(200).send(data))
    .catch(err=>err)
})

//Deleta tarefa no banco
app.delete('/tarefas/:id', (req, resp)=>{
    deletaTarefa(req)
    .then(data=>resp.status(200).send(console.log(data)))
    .catch(err=>err)
})

app.put('/tarefas/:id', (req, resp)=>{
    editaTarefa(req)
    .then(data=>resp.status(200).send(data))
    .catch(err=>err)
})


app.listen(8080, console.log('servidor iniciado!'))


process.on('SIGINT', ()=> {
    db.close((err) => {
        console.log("Banco encerrado com sucesso!");
        process.exit(0);
    })
})