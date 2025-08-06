package com.woundcare.assessment.presentation.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Medical/Healthcare color palette
private val LightMedicalBlue = Color(0xFF2196F3)
private val DarkMedicalBlue = Color(0xFF1976D2)
private val MedicalGreen = Color(0xFF4CAF50)
private val MedicalTeal = Color(0xFF009688)
private val WarningOrange = Color(0xFFFF9800)
private val ErrorRed = Color(0xFFF44336)
private val MedicalGray = Color(0xFF607D8B)

private val DarkColorScheme = darkColorScheme(
    primary = LightMedicalBlue,
    secondary = MedicalTeal,
    tertiary = MedicalGreen,
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
    error = ErrorRed,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White,
    onError = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = DarkMedicalBlue,
    secondary = MedicalTeal,
    tertiary = MedicalGreen,
    background = Color(0xFFFFFBFE),
    surface = Color(0xFFFFFBFE),
    error = ErrorRed,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1C1B1F),
    onSurface = Color(0xFF1C1B1F),
    onError = Color.White,
    
    // Medical-specific colors for containers
    primaryContainer = Color(0xFFE3F2FD),
    onPrimaryContainer = Color(0xFF0D47A1),
    secondaryContainer = Color(0xFFE0F2F1),
    onSecondaryContainer = Color(0xFF004D40),
    tertiaryContainer = Color(0xFFE8F5E8),
    onTertiaryContainer = Color(0xFF1B5E20),
    errorContainer = Color(0xFFFFEBEE),
    onErrorContainer = Color(0xFFB71C1C)
)

@Composable
fun WoundCareAssessmentTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}