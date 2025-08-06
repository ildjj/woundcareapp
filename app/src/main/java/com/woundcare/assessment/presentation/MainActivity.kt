package com.woundcare.assessment.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.AndroidEntryPoint
import com.woundcare.assessment.presentation.theme.WoundCareAssessmentTheme
import com.woundcare.assessment.presentation.dashboard.DashboardScreen
import com.woundcare.assessment.presentation.patients.PatientsScreen
import com.woundcare.assessment.presentation.assessment.AssessmentScreen
import com.woundcare.assessment.presentation.camera.CameraScreen
import com.woundcare.assessment.presentation.reports.ReportsScreen
import com.woundcare.assessment.presentation.settings.SettingsScreen

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    private val viewModel: MainViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        
        splashScreen.setKeepOnScreenCondition {
            viewModel.isLoading.value
        }
        
        setContent {
            WoundCareAssessmentTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = getScreenTitle(currentRoute ?: "dashboard"),
                        fontWeight = FontWeight.Medium
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        bottomBar = {
            if (shouldShowBottomBar(currentRoute)) {
                BottomNavigationBar(
                    navController = navController,
                    currentRoute = currentRoute
                )
            }
        }
    ) { paddingValues ->
        NavigationHost(
            navController = navController,
            modifier = Modifier.padding(paddingValues)
        )
    }
}

@Composable
fun NavigationHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Dashboard.route,
        modifier = modifier
    ) {
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToPatients = { navController.navigate(Screen.Patients.route) },
                onNavigateToCamera = { navController.navigate(Screen.Camera.route) },
                onNavigateToAssessment = { patientId, woundId ->
                    navController.navigate("${Screen.Assessment.route}/$patientId/$woundId")
                }
            )
        }
        
        composable(Screen.Patients.route) {
            PatientsScreen(
                onNavigateToAssessment = { patientId ->
                    navController.navigate("${Screen.Assessment.route}/$patientId")
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("${Screen.Assessment.route}/{patientId}") { backStackEntry ->
            val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
            AssessmentScreen(
                patientId = patientId,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToCamera = { woundId ->
                    navController.navigate("${Screen.Camera.route}/$woundId")
                }
            )
        }
        
        composable("${Screen.Assessment.route}/{patientId}/{woundId}") { backStackEntry ->
            val patientId = backStackEntry.arguments?.getString("patientId") ?: ""
            val woundId = backStackEntry.arguments?.getString("woundId") ?: ""
            AssessmentScreen(
                patientId = patientId,
                woundId = woundId,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToCamera = { selectedWoundId ->
                    navController.navigate("${Screen.Camera.route}/$selectedWoundId")
                }
            )
        }
        
        composable(Screen.Camera.route) {
            CameraScreen(
                onNavigateBack = { navController.popBackStack() },
                onPhotoTaken = { photoUri ->
                    // Handle photo taken
                    navController.popBackStack()
                }
            )
        }
        
        composable("${Screen.Camera.route}/{woundId}") { backStackEntry ->
            val woundId = backStackEntry.arguments?.getString("woundId") ?: ""
            CameraScreen(
                woundId = woundId,
                onNavigateBack = { navController.popBackStack() },
                onPhotoTaken = { photoUri ->
                    // Handle photo taken
                    navController.popBackStack()
                }
            )
        }
        
        composable(Screen.Reports.route) {
            ReportsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable(Screen.Settings.route) {
            SettingsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

@Composable
fun BottomNavigationBar(
    navController: NavHostController,
    currentRoute: String?
) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surfaceContainer,
        contentColor = MaterialTheme.colorScheme.onSurface
    ) {
        bottomNavItems.forEach { screen ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = screen.icon,
                        contentDescription = screen.title
                    )
                },
                label = {
                    Text(
                        text = screen.title,
                        fontSize = 12.sp
                    )
                },
                selected = currentRoute == screen.route,
                onClick = {
                    if (currentRoute != screen.route) {
                        navController.navigate(screen.route) {
                            // Clear back stack to the start destination
                            popUpTo(Screen.Dashboard.route) {
                                saveState = true
                            }
                            // Avoid multiple copies of the same destination
                            launchSingleTop = true
                            // Restore state when navigating back
                            restoreState = true
                        }
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )
        }
    }
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Filled.Dashboard)
    object Patients : Screen("patients", "Patients", Icons.Filled.Person)
    object Assessment : Screen("assessment", "Assessment", Icons.Filled.Assignment)
    object Camera : Screen("camera", "Camera", Icons.Filled.Camera)
    object Reports : Screen("reports", "Reports", Icons.Filled.Analytics)
    object Settings : Screen("settings", "Settings", Icons.Filled.Settings)
}

private val bottomNavItems = listOf(
    Screen.Dashboard,
    Screen.Patients,
    Screen.Assessment,
    Screen.Reports,
    Screen.Settings
)

private fun getScreenTitle(route: String): String {
    return when {
        route.startsWith("dashboard") -> "Wound Care Dashboard"
        route.startsWith("patients") -> "Patient Management"
        route.startsWith("assessment") -> "Wound Assessment"
        route.startsWith("camera") -> "Photo Documentation"
        route.startsWith("reports") -> "Reports & Analytics"
        route.startsWith("settings") -> "Settings"
        else -> "Wound Care Assessment"
    }
}

private fun shouldShowBottomBar(route: String?): Boolean {
    return route != null && !route.startsWith("camera")
}