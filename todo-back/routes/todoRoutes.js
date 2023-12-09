const express = require('express');

const {createTodo, getAllTodos, updateTodo, deleteTodo} = require('../controller/todoController')
const router = express.Router();


router.post('/', createTodo);
router.get('/', getAllTodos);
router.patch('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;