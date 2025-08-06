package com.woundcare.tracker.activities

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.navigation.NavigationView
import com.woundcare.tracker.R
import com.woundcare.tracker.databinding.ActivityMainBinding
import com.woundcare.tracker.database.WoundCareDatabase
import com.woundcare.tracker.utils.PermissionManager
import com.woundcare.tracker.viewmodels.MainViewModel
import com.woundcare.tracker.viewmodels.MainViewModelFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle
    private lateinit var viewModel: MainViewModel
    private lateinit var database: WoundCareDatabase
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize database
        database = WoundCareDatabase.getDatabase(this)
        
        // Setup ViewModel
        val factory = MainViewModelFactory(database)
        viewModel = ViewModelProvider(this, factory).get(MainViewModel::class.java)
        
        // Setup toolbar
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setHomeButtonEnabled(true)
        
        // Setup drawer
        drawerLayout = binding.drawerLayout
        toggle = ActionBarDrawerToggle(
            this,
            drawerLayout,
            binding.toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()
        
        // Setup navigation view
        binding.navView.setNavigationItemSelectedListener(this)
        
        // Setup main menu cards
        setupMainMenuCards()
        
        // Load dashboard data
        loadDashboardData()
        
        // Request permissions
        PermissionManager.requestAllPermissions(this)
    }
    
    private fun setupMainMenuCards() {
        // Patients Card
        binding.cardPatients.setOnClickListener {
            startActivity(Intent(this, PatientListActivity::class.java))
        }
        
        // New Assessment Card
        binding.cardNewAssessment.setOnClickListener {
            startActivity(Intent(this, PatientListActivity::class.java).apply {
                putExtra("SELECT_FOR_ASSESSMENT", true)
            })
        }
        
        // Dashboard Card
        binding.cardDashboard.setOnClickListener {
            startActivity(Intent(this, DashboardActivity::class.java))
        }
        
        // Quick Capture Card
        binding.cardQuickCapture.setOnClickListener {
            startActivity(Intent(this, PhotoCaptureActivity::class.java).apply {
                putExtra("QUICK_CAPTURE", true)
            })
        }
    }
    
    private fun loadDashboardData() {
        CoroutineScope(Dispatchers.Main).launch {
            // Observe patient count
            viewModel.totalPatients.observe(this@MainActivity) { count ->
                binding.tvPatientCount.text = count.toString()
            }
            
            // Observe active wounds count
            viewModel.activeWounds.observe(this@MainActivity) { wounds ->
                binding.tvActiveWoundsCount.text = wounds.size.toString()
            }
            
            // Observe today's assessments
            viewModel.todayAssessments.observe(this@MainActivity) { count ->
                binding.tvTodayAssessments.text = count.toString()
            }
            
            // Observe pending reviews
            viewModel.pendingReviews.observe(this@MainActivity) { count ->
                binding.tvPendingReviews.text = count.toString()
            }
        }
    }
    
    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_patients -> {
                startActivity(Intent(this, PatientListActivity::class.java))
            }
            R.id.nav_assessments -> {
                startActivity(Intent(this, AssessmentListActivity::class.java))
            }
            R.id.nav_dashboard -> {
                startActivity(Intent(this, DashboardActivity::class.java))
            }
            R.id.nav_reports -> {
                startActivity(Intent(this, ReportsActivity::class.java))
            }
            R.id.nav_settings -> {
                startActivity(Intent(this, SettingsActivity::class.java))
            }
            R.id.nav_help -> {
                startActivity(Intent(this, HelpActivity::class.java))
            }
            R.id.nav_about -> {
                showAboutDialog()
            }
        }
        
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }
    
    private fun showAboutDialog() {
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("About Wound Care Tracker")
            .setMessage("Version 1.0\n\nAI-powered wound assessment and tracking application\n\n© 2024 Wound Care Solutions")
            .setPositiveButton("OK", null)
            .show()
    }
    
    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}