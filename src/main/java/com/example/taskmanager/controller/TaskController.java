package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.Category;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Port de React
@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;
    private final CategoryRepository categoryRepository;

    public TaskController(TaskService taskService, CategoryRepository categoryRepository) {
        this.taskService = taskService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getCategory() != null && task.getCategory().getId() != null) {
            Category category = categoryRepository.findById(task.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            task.setCategory(category);
        }
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
