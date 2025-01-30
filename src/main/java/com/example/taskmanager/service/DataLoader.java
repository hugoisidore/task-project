package com.example.taskmanager.service;

import com.example.taskmanager.model.Category;
import com.example.taskmanager.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {
    private final CategoryRepository categoryRepository;

    public DataLoader(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostConstruct
    public void initCategories() {
        createCategoryIfNotExists("Travail");
        createCategoryIfNotExists("Urgent");
        createCategoryIfNotExists("Long terme");
    }

    private void createCategoryIfNotExists(String name) {
        if (categoryRepository.findByName(name).isEmpty()) {
            categoryRepository.save(new Category(name));
        }
    }
}
