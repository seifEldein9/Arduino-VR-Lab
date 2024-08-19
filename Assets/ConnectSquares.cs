using UnityEngine;
using System.Collections.Generic;

public class ConnectSquares : MonoBehaviour
{
    public GameObject mainSquare;  
    public GameObject[] connectedSquares;  
    private bool isDragging = false; 
    private LineRenderer currentLineRenderer;  
    private List<LineRenderer> lines = new List<LineRenderer>();  

    void Update()
    {
        if (Input.GetMouseButtonDown(0)) 
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            
            if (Physics.Raycast(ray, out hit))
            {
                if (hit.transform.gameObject == mainSquare)
                {
                    isDragging = true;  
                    CreateLineRenderer();  
                }
            }
        }

        if (Input.GetMouseButton(0) && isDragging) 
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            Plane plane = new Plane(Vector3.up, 0);
            float distance;
            if (plane.Raycast(ray, out distance))
            {
                Vector3 point = ray.GetPoint(distance);
                currentLineRenderer.SetPosition(0, mainSquare.transform.position);
                currentLineRenderer.SetPosition(1, point);
            }
        }

        if (Input.GetMouseButtonUp(0) && isDragging) 
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;

            if (Physics.Raycast(ray, out hit))
            {
                foreach (var square in connectedSquares)
                {
                    if (hit.transform.gameObject == square)
                    {
                        currentLineRenderer.SetPosition(1, square.transform.position);  
                        break;
                    }
                }
            }

            isDragging = false;  
        }
    }

    void CreateLineRenderer()
    {
   
        GameObject lineObject = new GameObject("Line");
        currentLineRenderer = lineObject.AddComponent<LineRenderer>();
        currentLineRenderer.startWidth = 0.05f;
        currentLineRenderer.endWidth = 0.05f;
        currentLineRenderer.positionCount = 2;
        currentLineRenderer.useWorldSpace = true;
        currentLineRenderer.material = new Material(Shader.Find("Sprites/Default"));
        
   
        lines.Add(currentLineRenderer);
    }
}
