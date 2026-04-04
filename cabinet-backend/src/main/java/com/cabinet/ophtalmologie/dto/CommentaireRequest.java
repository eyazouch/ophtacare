package com.cabinet.ophtalmologie.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentaireRequest {

    @NotBlank(message = "Le commentaire est obligatoire")
    private String commentaire;
}
