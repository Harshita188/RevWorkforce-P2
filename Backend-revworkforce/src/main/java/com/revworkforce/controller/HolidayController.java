package com.revworkforce.controller;
import com.revworkforce.entity.Holiday;
import com.revworkforce.repository.HolidayRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    private final HolidayRepository repository;

    public HolidayController(HolidayRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Holiday addHoliday(@RequestBody Holiday holiday) {
        return repository.save(holiday);
    }

    @GetMapping
    public List<Holiday> getAll() {
        return repository.findAll();
    }
}
